use serde::{Deserialize, Serialize};
use std::time::Instant;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfilerResult {
    pub nonces: u32,
    pub threads: u32,
    pub time_s: f64,
    pub speed_gib_s: f64,
    pub data_size: u32, // in GiB
    pub duration: u32,  // in seconds
    pub data_file: Option<String>, // Path to data file used
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfilerConfig {
    pub data_size: u32, // in GiB
    pub duration: u32,  // in seconds
    pub data_file: Option<String>, // Optional custom path for data file
}

#[command]
pub async fn get_default_config() -> ProfilerConfig {
    ProfilerConfig {
        data_size: 1, // Default 1 GiB
        duration: 10, // Default 10 seconds
        data_file: None, // No custom path by default
    }
}

#[command]
pub async fn run_profiler(
    app: tauri::AppHandle,
    nonces: u32,
    threads: u32,
    config: Option<ProfilerConfig>,
) -> Result<ProfilerResult, String> {
    // Validate required parameters
    if nonces == 0 {
        return Err("Nonces parameter is required".to_string());
    }

    // Validate nonces is multiple of 16
    if nonces % 16 != 0 {
        return Err("Nonces must be a multiple of 16".to_string());
    }

    // Use default config if none provided
    let config = config.unwrap_or_else(|| ProfilerConfig {
        data_size: 1,
        duration: 10,
        data_file: None,
    });

    // Use custom data file path if provided, otherwise create temporary directory
    let data_file = if let Some(path) = &config.data_file {
        std::path::PathBuf::from(path)
    } else {
        let temp_dir = std::env::temp_dir().join("sm-init-profiler");
        if !temp_dir.exists() {
            std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;
        }
        temp_dir.join("profiler-data")
    };

    // Get the path to the bundled profiler binary
    let resource_path = app
        .path_resolver()
        .resource_dir()
        .ok_or_else(|| "Failed to get resource directory".to_string())?;
    let profiler_path =
        resource_path
            .join("bin")
            .join("profiler")
            .join(if cfg!(target_os = "windows") {
                "profiler.exe"
            } else {
                "profiler"
            });

    if !profiler_path.exists() {
        return Err(format!("Profiler binary not found at {:?}", profiler_path));
    }

    // Run profiler
    let start = Instant::now();

    let output = std::process::Command::new(&profiler_path)
        .arg("--threads")
        .arg(threads.to_string())
        .arg("--nonces")
        .arg(nonces.to_string())
        .arg("--data-file")
        .arg(&data_file)
        .arg("--data-size")
        .arg(config.data_size.to_string())
        .arg("--duration")
        .arg(config.duration.to_string())
        .output()
        .map_err(|e| format!("Failed to run profiler: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    // Parse profiler output
    let parsed_output: serde_json::Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse profiler output: {}", e))?;

    // Extract values from parsed output
    let time_s = parsed_output["time_s"]
        .as_f64()
        .ok_or_else(|| "Missing time_s in output".to_string())?;
    let speed_gib_s = parsed_output["speed_gib_s"]
        .as_f64()
        .ok_or_else(|| "Missing speed_gib_s in output".to_string())?;

    // Only cleanup if using temporary file
    if config.data_file.is_none() {
        let _ = std::fs::remove_file(data_file);
    }

    Ok(ProfilerResult {
        nonces,
        threads,
        time_s,
        speed_gib_s,
        data_size: config.data_size,
        duration: config.duration,
        data_file: config.data_file,
    })
}

// Helper function to calculate probability of finding PoST in one pass
#[command]
pub fn calculate_post_probability(nonces: u32) -> f64 {
    // Using simplified probability calculation
    // Full formula: 1-(1-(1-BINOM.DIST(36,10^9,26/10^9,TRUE)))^nonces
    // This is a simplified approximation
    let base_prob: f64 = 0.0124; // Probability for 16 nonces
    let groups = nonces as f64 / 16.0;
    1.0f64 - (1.0f64 - base_prob).powf(groups)
}

use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfilerResult {
    pub time_s: f64,
    pub speed_gib_s: f64,
}

#[command]
pub async fn run_profiler(
    app: tauri::AppHandle,
    threads: Option<u32>,
    data_size: Option<u32>,
    duration: Option<u32>,
) -> Result<ProfilerResult, String> {
    // Default values if not provided
    let threads = threads.unwrap_or(4);
    let data_size = data_size.unwrap_or(1);
    let duration = duration.unwrap_or(10);

    // Create temporary directory for profiler data
    let temp_dir = std::env::temp_dir().join("sm-init-profiler");
    if !temp_dir.exists() {
        std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;
    }

    // Get the path to the bundled profiler binary from the resource directory
    let resource_path = app.path_resolver().resource_dir()
        .ok_or_else(|| "Failed to get resource directory".to_string())?;
    let profiler_path = resource_path.join("bin").join("profiler").join(
        if cfg!(target_os = "windows") {
            "profiler.exe"
        } else {
            "profiler"
        }
    );

    // Log the path and check if file exists
    println!("Looking for profiler at: {:?}", profiler_path);
    if !profiler_path.exists() {
        return Err(format!("Profiler binary not found at {:?}", profiler_path));
    }

    // Run profiler command
    let output = std::process::Command::new(profiler_path)
        .arg("--threads")
        .arg(threads.to_string())
        .arg("--data-size")
        .arg(data_size.to_string())
        .arg("--duration")
        .arg(duration.to_string())
        .arg("--data-file")
        .arg(temp_dir.join("profiler-data").to_str().unwrap())
        .output()
        .map_err(|e| format!("Failed to run profiler: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    // Parse profiler output
    let result: ProfilerResult = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Failed to parse profiler output: {}", e))?;

    Ok(result)
}

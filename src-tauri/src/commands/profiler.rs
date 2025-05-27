//! Profiler Module
//! 
//! This module provides functionality for performance profiling and benchmarking.
//! It includes commands for running performance tests, managing profiler configuration,
//! and calculating probabilities for PoST (Proof of Space-Time) operations.
//! 
//! The profiler supports customizable parameters such as:
//! - Number of nonces
//! - Thread count
//! - Data size
//! - Test duration
//! - Custom data file paths

use serde::{Deserialize, Serialize};
use tauri::command;

/// Represents the results of a profiling run
/// 
/// Contains comprehensive metrics and configuration details from
/// a completed profiling operation.
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
    /// Size of data to process in GiB
    pub data_size: u32,
    /// Duration of the profiling run in seconds
    pub duration: u32,
    /// Optional custom path for the data file
    pub data_file: Option<String>,
}

/// Retrieves default configuration settings for the profiler
/// 
/// Provides sensible default values for profiler configuration
/// that can be used as a starting point for profiling runs.
/// 
/// # Returns
/// 
/// * `ProfilerConfig` - Default configuration with:
///   - 1 GiB data size
///   - 10 seconds duration
///   - No custom data file path
#[command]
pub async fn get_default_config() -> ProfilerConfig {
    ProfilerConfig {
        data_size: 1, // Default 1 GiB
        duration: 10, // Default 10 seconds
        data_file: None, // No custom path by default
    }
}

/// Executes a profiling run with specified parameters
/// 
/// This command runs a performance profiling operation using the provided
/// configuration. It manages temporary files, executes the profiler binary,
/// and collects results.
/// 
/// # Arguments
/// 
/// * `app` - Tauri application handle for resource access
/// * `nonces` - Number of nonces to use (must be multiple of 16)
/// * `threads` - Number of threads to utilize
/// * `config` - Optional custom configuration settings
/// 
/// # Returns
/// 
/// * `Ok(ProfilerResult)` - Results and metrics from the profiling run
/// * `Err(String)` - Error message if profiling fails
/// 
/// # Validation
/// 
/// - Validates that nonces is non-zero and multiple of 16
/// - Ensures profiler binary exists
/// - Verifies output can be parsed correctly
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
/// Calculates the probability of finding a valid PoST in one pass
/// 
/// This function implements a simplified probability calculation for
/// Proof of Space-Time success based on the number of nonces.
/// 
/// # Arguments
/// 
/// * `nonces` - Number of nonces to use in calculation
/// 
/// # Returns
/// 
/// * `f64` - Probability value between 0 and 1
/// 
/// # Implementation Notes
/// 
/// Uses a simplified approximation of the full binomial probability formula:
/// 1-(1-(1-BINOM.DIST(36,10^9,26/10^9,TRUE)))^nonces
/// 
/// The base probability (0.0124) is calibrated for 16 nonces and scaled
/// based on the input nonce count.
#[command]
pub fn calculate_post_probability(nonces: u32) -> f64 {
    // Using simplified probability calculation
    // Full formula: 1-(1-(1-BINOM.DIST(36,10^9,26/10^9,TRUE)))^nonces
    // This is a simplified approximation
    let base_prob: f64 = 0.0124; // Probability for 16 nonces
    let groups = nonces as f64 / 16.0;
    1.0f64 - (1.0f64 - base_prob).powf(groups)
}

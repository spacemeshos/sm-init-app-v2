use serde::{Deserialize, Serialize};
use std::time::Instant;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct GPUMetrics {
    pub hash_rate: f64,           // hashes/second
    pub memory_throughput: f64,   // GB/s
    pub gpu_utilization: f64,     // percentage
    pub data_speed: f64,          // GiB/s
    pub estimated_time: Option<f64>, // seconds
    pub gpu_model: Option<String>,   // GPU model name
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GPUProfilerConfig {
    pub target_data_size: u32,    // GiB
    pub duration: u32,            // seconds
    pub output_path: Option<String>,
}

#[command]
pub async fn get_gpu_info() -> Result<Vec<String>, String> {
    // TODO: Implement GPU detection using platform-specific APIs
    // For now return mock data
    Ok(vec!["NVIDIA GeForce RTX 3080".to_string()])
}

#[command]
pub async fn run_gpu_profiler(
    app: tauri::AppHandle,
    config: GPUProfilerConfig,
) -> Result<GPUMetrics, String> {
    // Get the path to postcli binary
    let resource_path = app
        .path_resolver()
        .resource_dir()
        .ok_or_else(|| "Failed to get resource directory".to_string())?;
    
    let postcli_path = resource_path
        .join("bin")
        .join("postcli")
        .join(if cfg!(target_os = "windows") {
            "postcli.exe"
        } else {
            "postcli"
        });

    if !postcli_path.exists() {
        return Err(format!("postcli binary not found at {:?}", postcli_path));
    }

    // Create a temporary directory for the test data
    let temp_dir = std::env::temp_dir().join("sm-init-gpu-test");
    if !temp_dir.exists() {
        std::fs::create_dir_all(&temp_dir)
            .map_err(|e| format!("Failed to create temp directory: {}", e))?;
    }

    // Run postcli to generate a small amount of data (1 GiB) and measure the speed
    let start = Instant::now();
    
    let output = std::process::Command::new(&postcli_path)
        .arg("init")
        .arg("--size")
        .arg("1") // 1 GiB test
        .arg("--out-dir")
        .arg(&temp_dir)
        .output()
        .map_err(|e| format!("Failed to run postcli: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    let duration = start.elapsed();
    let speed_gib_s = 1.0 / duration.as_secs_f64(); // GiB/s

    // Clean up test data
    std::fs::remove_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to clean up temp directory: {}", e))?;

    // Calculate metrics
    Ok(GPUMetrics {
        hash_rate: speed_gib_s * 1024.0 * 1024.0 * 1024.0 / 32.0, // Convert GiB/s to hashes/s (32 bytes per hash)
        memory_throughput: speed_gib_s * 1024.0, // Convert GiB/s to GB/s
        gpu_utilization: 100.0, // Assuming full utilization during test
        data_speed: speed_gib_s,
        estimated_time: Some((config.target_data_size as f64 / speed_gib_s) as f64),
        gpu_model: Some("GPU".to_string()), // TODO: Implement actual GPU detection
    })
}

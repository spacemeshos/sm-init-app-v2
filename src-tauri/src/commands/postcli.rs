use std::env;
use std::path::PathBuf;
use std::process::Command;
use serde::Serialize;

#[derive(Serialize)]
pub struct CommandOutput {
    stdout: String,
    stderr: String,
}

#[derive(Serialize)]
pub struct DetachedProcessInfo {
    process_id: u32,
    message: String,
}

#[tauri::command]
pub fn run_postcli_command(args: Vec<String>) -> Result<CommandOutput, String> {
    let mut path: PathBuf = env::current_dir().map_err(|e| e.to_string())?;
    path.push("bin/postcli/postcli");

    // Check if postcli exists
    if !path.exists() {
        return Err("postcli executable not found. Please ensure it's installed in the bin/postcli directory.".to_string());
    }

    let postcli_path = path.to_str().ok_or("Invalid path")?;

    println!("Executing postcli with args: {:?}", args);

    let output = Command::new(postcli_path)
        .args(&args)
        .output()
        .map_err(|e| format!("Failed to execute postcli: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    // Log the output for debugging
    if !stdout.is_empty() {
        println!("postcli stdout: {}", stdout);
    }
    if !stderr.is_empty() {
        eprintln!("postcli stderr: {}", stderr);
    }

    Ok(CommandOutput { stdout, stderr })
}

#[tauri::command]
pub fn run_postcli_detached(args: Vec<String>) -> Result<DetachedProcessInfo, String> {
    let mut path: PathBuf = env::current_dir().map_err(|e| e.to_string())?;
    path.push("bin/postcli/postcli");

    // Check if postcli exists
    if !path.exists() {
        return Err("postcli executable not found. Please ensure it's installed in the bin/postcli directory.".to_string());
    }

    let postcli_path = path.to_str().ok_or("Invalid path")?;

    println!("Executing postcli in detached mode with args: {:?}", args);

    let child = Command::new(postcli_path)
        .args(&args)
        .spawn()
        .map_err(|e| format!("Failed to execute postcli: {}", e))?;

    let process_id = child.id();

    Ok(DetachedProcessInfo {
        process_id,
        message: format!("POS data generation started in background with process ID: {}", process_id),
    })
}

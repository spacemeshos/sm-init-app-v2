//! PostCLI Integration Module
//! 
//! This module provides functionality for interacting with the PostCLI executable.
//! It includes commands for running PostCLI processes both synchronously and asynchronously,
//! managing process lifecycle, and handling process output in a cross-platform manner.
//! 
//! The module supports both Unix-like systems and Windows, with platform-specific
//! implementations for process management operations.

use std::env;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::thread;
use serde::Serialize;
use tauri::Manager;
use std::io::{BufRead, BufReader};

// Platform-specific imports for process management
#[cfg(unix)]
use nix::sys::signal::{kill, Signal};
#[cfg(unix)]
use nix::unistd::Pid;
#[cfg(windows)]
use winapi::um::processthreadsapi::OpenProcess;
#[cfg(windows)]
use winapi::um::processthreadsapi::TerminateProcess;
#[cfg(windows)]
use winapi::um::winnt::PROCESS_TERMINATE;
#[cfg(windows)]
use winapi::um::handleapi::CloseHandle;

/// Represents the output of a synchronous PostCLI command execution
#[derive(Serialize)]
pub struct CommandOutput {
    stdout: String,
    stderr: String,
}

/// Contains information about a detached PostCLI process
#[derive(Serialize)]
pub struct DetachedProcessInfo {
    /// Process ID of the detached process
    process_id: u32,
    /// Human-readable status message
    message: String,
}

/// Determines the platform-specific path to the PostCLI executable
/// 
/// This function constructs the path to the PostCLI executable based on the current
/// working directory and platform-specific executable naming conventions.
/// 
/// # Returns
/// 
/// * `PathBuf` - The complete path to the PostCLI executable
fn get_postcli_path() -> PathBuf {
    let mut path: PathBuf = env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    path.push("bin");
    path.push("postcli");
    #[cfg(windows)]
    path.push("postcli.exe");
    #[cfg(unix)]
    path.push("postcli");
    path
}

/// Executes a PostCLI command synchronously
/// 
/// This command runs the PostCLI executable with the provided arguments and waits
/// for completion, capturing both stdout and stderr.
/// 
/// # Arguments
/// 
/// * `args` - Vector of command-line arguments to pass to PostCLI
/// 
/// # Returns
/// 
/// * `Ok(CommandOutput)` - Contains stdout and stderr if execution was successful
/// * `Err(String)` - Error message if execution failed
/// 
/// # Example
/// 
/// ```rust
/// let output = run_postcli_command(vec!["--version".to_string()])?;
/// println!("PostCLI output: {}", output.stdout);
/// ```
#[tauri::command]
pub fn run_postcli_command(args: Vec<String>) -> Result<CommandOutput, String> {
    let path = get_postcli_path();

    // Check if postcli exists
    if !path.exists() {
        return Err(format!(
            "postcli executable not found at {}. Please ensure it's installed in the bin/postcli directory.",
            path.display()
        ));
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

/// Executes a PostCLI command asynchronously in a detached process
/// 
/// This command starts PostCLI in a separate process and sets up output streaming
/// through Tauri events. The process runs independently of the main application.
/// 
/// # Arguments
/// 
/// * `args` - Vector of command-line arguments to pass to PostCLI
/// * `app` - Tauri application handle for event emission
/// 
/// # Returns
/// 
/// * `Ok(DetachedProcessInfo)` - Contains process ID and status message
/// * `Err(String)` - Error message if process creation failed
/// 
/// # Events
/// 
/// Emits 'postcli-log' events with stdout/stderr content as they become available
/// 
/// # Example
/// 
/// ```rust
/// let process_info = run_postcli_detached(vec!["--generate".to_string()], app_handle).await?;
/// println!("Started process: {}", process_info.process_id);
/// ```
#[tauri::command]
pub async fn run_postcli_detached(args: Vec<String>, app: tauri::AppHandle) -> Result<DetachedProcessInfo, String> {
    let path = get_postcli_path();

    // Check if postcli exists
    if !path.exists() {
        return Err(format!(
            "postcli executable not found at {}. Please ensure it's installed in the bin/postcli directory.",
            path.display()
        ));
    }

    let postcli_path = path.to_str().ok_or("Invalid path")?;

    println!("Executing postcli in detached mode with args: {:?}", args);

    let child = Command::new(postcli_path)
        .args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to execute postcli: {}", e))?;

    let process_id = child.id();

    // Handle stdout in a separate thread
    if let Some(stdout) = child.stdout {
        let app_clone = app.clone();
        thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(line) = line {
                    println!("postcli stdout: {}", line);
                    app_clone.emit_all("postcli-log", format!("stdout: {}", line)).unwrap();
                }
            }
        });
    }

    // Handle stderr in a separate thread
    if let Some(stderr) = child.stderr {
        let app_clone = app.clone();
        thread::spawn(move || {
            let reader = BufReader::new(stderr);
            for line in reader.lines() {
                if let Ok(line) = line {
                    eprintln!("postcli stderr: {}", line);
                    app_clone.emit_all("postcli-log", format!("stderr: {}", line)).unwrap();
                }
            }
        });
    }

    Ok(DetachedProcessInfo {
        process_id,
        message: format!("POS data generation started in background with process ID: {}", process_id),
    })
}

/// Terminates a running PostCLI process
/// 
/// This command attempts to gracefully terminate a PostCLI process using
/// platform-specific mechanisms (SIGTERM on Unix, TerminateProcess on Windows).
/// 
/// # Arguments
/// 
/// * `pid` - Process ID of the PostCLI process to terminate
/// 
/// # Returns
/// 
/// * `Ok(String)` - Success message if process was terminated
/// * `Err(String)` - Error message if termination failed
/// 
/// # Platform-specific behavior
/// 
/// * Unix: Uses SIGTERM signal
/// * Windows: Uses TerminateProcess API
/// 
/// # Example
/// 
/// ```rust
/// match stop_postcli_process(process_id) {
///     Ok(msg) => println!("Process stopped: {}", msg),
///     Err(e) => eprintln!("Failed to stop process: {}", e),
/// }
/// ```
#[tauri::command]
pub fn stop_postcli_process(pid: u32) -> Result<String, String> {
    println!("Attempting to stop postcli process with PID: {}", pid);

    #[cfg(unix)]
    {
        match kill(Pid::from_raw(pid as i32), Signal::SIGTERM) {
            Ok(_) => Ok(format!("Successfully terminated process {}", pid)),
            Err(e) => Err(format!("Failed to terminate process {}: {}", pid, e))
        }
    }

    #[cfg(windows)]
    {
        unsafe {
            let handle = OpenProcess(PROCESS_TERMINATE, 0, pid);
            if handle.is_null() {
                return Err(format!("Failed to open process {}", pid));
            }

            let result = TerminateProcess(handle, 0);
            CloseHandle(handle);

            if result == 0 {
                Err(format!("Failed to terminate process {}", pid))
            } else {
                Ok(format!("Successfully terminated process {}", pid))
            }
        }
    }
}

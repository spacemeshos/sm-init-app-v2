use std::env;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::thread;
use serde::Serialize;
use tauri::Manager;
use std::io::{BufRead, BufReader};
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

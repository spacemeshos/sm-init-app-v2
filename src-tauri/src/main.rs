// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use std::path::PathBuf;
use std::process::Command;
use sys_info::disk_info;
use tauri::api::dialog::FileDialogBuilder;

#[tauri::command]
async fn select_directory() -> Result<String, String> {
    let (sender, receiver) = std::sync::mpsc::channel();

    FileDialogBuilder::new().pick_folder(move |dir: Option<PathBuf>| {
        if let Some(dir) = dir {
            sender.send(dir.to_str().map(|s| s.to_string())).unwrap();
        } else {
            sender.send(None).unwrap();
        }
    });

    let selected_dir = receiver
        .recv()
        .map_err(|_| "Failed to receive directory".to_string())?
        .ok_or("No directory selected".to_string())?;

    let disk_info = disk_info().map_err(|_| "Failed to get disk info".to_string())?;

    if disk_info.free < 256 * 1024 * 1024 * 1024 {
        return Err("Selected directory does not have enough free space".into());
    }

    Ok(selected_dir)
}


#[tauri::command]
fn run_postcli_command(args: Vec<String>) -> Result<String, String> {
    // Get the current working directory
    let mut path: PathBuf = env::current_dir().map_err(|e| e.to_string())?;
    // Append the relative path to the binary
    path.push("./bin/postcli/postcli");

    // Convert the PathBuf to a string
    let postcli_path = path.to_str().ok_or("Invalid path")?;

    let output = Command::new(postcli_path).args(&args).output();

    match output {
        Ok(output) => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            select_directory,
            run_postcli_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

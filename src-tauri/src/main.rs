// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn run_postcli_command(args: Vec<String>) -> Result<String, String> {
    use std::process::Command;
    
    let output = Command::new("/Users/monikasmolarek/SM/sm-init-app-v2/src-tauri/src/postcli")
        .args(&args)
        .output();

    match output {
        Ok(output) => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_postcli_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
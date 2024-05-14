// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![run_cli_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
#[tauri::command]
fn run_cli_command(args: Vec<String>) -> Result<String, String> {
    use std::process::Command;
    let output = Command::new("../postcli/postcli")
        .args(&args)
        .output();

    match output {
        Ok(output) => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        Err(e) => Err(e.to_string()),
    }
}
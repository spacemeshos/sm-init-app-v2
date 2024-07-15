// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::file_dialog::select_directory,
            commands::postcli::run_postcli_command,
            commands::cpu::get_cpu_cores
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

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
            commands::file_dialog::verify_directory,
            commands::file_dialog::check_directory_space,
            commands::file_dialog::check_write_permission,
            commands::postcli::run_postcli_command,
            commands::postcli::run_postcli_detached,
            commands::postcli::stop_postcli_process,
            commands::cpu::get_cpu_cores,
            commands::profiler::run_profiler,
            commands::profiler::get_default_config,
            commands::profiler::calculate_post_probability,
            commands::gpu_profiler::get_gpu_info,
            commands::gpu_profiler::run_gpu_profiler,
            commands::post_providers::get_providers,
            commands::post_providers::benchmark_provider,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
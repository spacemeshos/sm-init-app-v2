#[tauri::command]
pub fn get_cpu_cores() -> usize {
    num_cpus::get()
}
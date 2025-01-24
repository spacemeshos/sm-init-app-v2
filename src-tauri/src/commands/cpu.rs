//! CPU Information Module
//! 
//! This module provides functionality for retrieving CPU-related information
//! from the system. It uses the `num_cpus` crate to access system CPU details.

#[tauri::command]
pub fn get_cpu_cores() -> usize {
    // Get the number of logical CPUs (including virtual cores)
    num_cpus::get()
}

use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn get_file_size(file_path: String) -> Result<u64, String> {
    let path = PathBuf::from(file_path);
    match fs::metadata(&path) {
        Ok(metadata) => Ok(metadata.len()),
        Err(err) => Err(format!("Failed to get file size: {}", err)),
    }
}

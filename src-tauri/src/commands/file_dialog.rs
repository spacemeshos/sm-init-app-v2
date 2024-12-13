use std::path::PathBuf;
use std::fs;
use tauri::api::dialog::FileDialogBuilder;
use sys_info;

#[derive(Debug, serde::Serialize)]
pub struct DirectoryValidation {
    exists: bool,
    has_write_permission: bool,
    has_space: bool,
    error: Option<String>,
}

#[tauri::command]
pub async fn select_directory() -> Result<String, String> {
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

    Ok(selected_dir)
}

fn get_available_space(_path: &PathBuf) -> Result<u64, String> {
    let disk_info = sys_info::disk_info()
        .map_err(|e| format!("Failed to get disk info: {}", e))?;
    
    // Convert KB to bytes (sys_info returns values in KB)
    let free_space = disk_info.free * 1024;
    Ok(free_space)
}

#[tauri::command]
pub async fn verify_directory(path: String) -> Result<DirectoryValidation, String> {
    let path = PathBuf::from(path);
    let mut validation = DirectoryValidation {
        exists: false,
        has_write_permission: false,
        has_space: false,
        error: None,
    };

    // Check if directory exists
    validation.exists = path.exists() && path.is_dir();
    if !validation.exists {
        validation.error = Some("Directory does not exist".to_string());
        return Ok(validation);
    }

    // Check write permissions by attempting to create a temporary file
    let temp_file_path = path.join(".write_test_temp");
    match fs::write(&temp_file_path, b"test") {
        Ok(_) => {
            validation.has_write_permission = true;
            // Clean up the test file
            let _ = fs::remove_file(temp_file_path);
        }
        Err(e) => {
            validation.has_write_permission = false;
            validation.error = Some(format!("No write permission: {}", e));
            return Ok(validation);
        }
    }

    // Check available space
    match get_available_space(&path) {
        Ok(space) => {
            // Require at least 1GB of free space
            const MIN_REQUIRED_SPACE: u64 = 1024 * 1024 * 1024; // 1GB in bytes
            validation.has_space = space >= MIN_REQUIRED_SPACE;
            if !validation.has_space {
                validation.error = Some(format!(
                    "Insufficient disk space. Required: 1GB, Available: {:.2} GB",
                    space as f64 / (1024.0 * 1024.0 * 1024.0)
                ));
            }
        }
        Err(e) => {
            validation.has_space = false;
            validation.error = Some(format!("Failed to check disk space: {}", e));
        }
    }

    Ok(validation)
}

#[tauri::command]
pub async fn check_directory_space(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    
    if !path.exists() || !path.is_dir() {
        return Err("Directory does not exist".to_string());
    }

    match get_available_space(&path) {
        Ok(space) => {
            // Require at least 1GB of free space
            const MIN_REQUIRED_SPACE: u64 = 1024 * 1024 * 1024; // 1GB in bytes
            Ok(space >= MIN_REQUIRED_SPACE)
        }
        Err(e) => Err(format!("Failed to check disk space: {}", e)),
    }
}

#[tauri::command]
pub async fn check_write_permission(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    
    if !path.exists() || !path.is_dir() {
        return Err("Directory does not exist".to_string());
    }

    // Try to create a temporary file to verify write permissions
    let temp_file_path = path.join(".write_test_temp");
    match fs::write(&temp_file_path, b"test") {
        Ok(_) => {
            // Clean up the test file
            let _ = fs::remove_file(temp_file_path);
            Ok(true)
        }
        Err(_) => Ok(false),
    }
}

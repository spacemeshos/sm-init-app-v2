use std::fs;
use std::path::PathBuf;
use tauri::api::dialog::FileDialogBuilder;

// Constant for minimum required space (256 GiB in bytes)
const MIN_REQUIRED_SPACE: f64 = 256.0 * 1024.0 * 1024.0 * 1024.0;

#[derive(Debug, serde::Serialize)]
pub struct DirectoryValidation {
    exists: bool,
    has_write_permission: bool,
    has_space: bool,
    available_space_gb: f64,
    error: Option<String>,
}

#[tauri::command]
pub async fn select_directory() -> Result<(String, f64), String> {
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

    let path = PathBuf::from(&selected_dir);
    let free_space_bytes = get_available_space(&path)?;
    let free_space_gb = free_space_bytes as f64 / (1024.0 * 1024.0 * 1024.0);

    Ok((selected_dir, free_space_gb))
}

#[cfg(target_family = "unix")]
fn get_available_space(path: &PathBuf) -> Result<u64, String> {
    use std::os::unix::fs::MetadataExt;
    
    let metadata = fs::metadata(path)
        .map_err(|e| format!("Failed to get metadata: {}", e))?;
    
    // On Unix systems, we can get the device ID from metadata
    let dev_id = metadata.dev();
    
    // Use statvfs to get filesystem information
    let mut stat: libc::statvfs = unsafe { std::mem::zeroed() };
    let path_str = path.to_str()
        .ok_or("Invalid path")?;
    
    let result = unsafe {
        libc::statvfs(
            std::ffi::CString::new(path_str)
                .map_err(|e| format!("Invalid path: {}", e))?
                .as_ptr(),
            &mut stat
        )
    };

    if result == 0 {
        // Calculate available space using f_bavail (blocks available to non-superuser)
        // and f_frsize (fundamental file system block size)
        let available_space = stat.f_bavail as u64 * stat.f_frsize as u64;
        Ok(available_space)
    } else {
        Err("Failed to get filesystem statistics".to_string())
    }
}

#[cfg(target_family = "windows")]
fn get_available_space(path: &PathBuf) -> Result<u64, String> {
    use std::os::windows::ffi::OsStrExt;
    use std::iter::once;
    use std::ffi::OsStr;
    
    let path_str = path.to_str()
        .ok_or("Invalid path")?;
        
    let wide: Vec<u16> = OsStr::new(path_str)
        .encode_wide()
        .chain(once(0))
        .collect();
        
    let mut free_bytes: libc::c_ulonglong = 0;
    let mut total_bytes: libc::c_ulonglong = 0;
    let mut available_bytes: libc::c_ulonglong = 0;
    
    let result = unsafe {
        libc::GetDiskFreeSpaceExW(
            wide.as_ptr(),
            &mut free_bytes,
            &mut total_bytes,
            &mut available_bytes,
        )
    };
    
    if result != 0 {
        Ok(available_bytes as u64)
    } else {
        Err("Failed to get disk space information".to_string())
    }
}

#[tauri::command]
pub async fn verify_directory(path: String, required_space_gb: Option<f64>) -> Result<DirectoryValidation, String> {
    let path = PathBuf::from(path);
    let required_space = required_space_gb.unwrap_or(256.0) * 1024.0 * 1024.0 * 1024.0; // Default to 256 GiB

    let mut validation = DirectoryValidation {
        exists: false,
        has_write_permission: false,
        has_space: false,
        available_space_gb: 0.0,
        error: None,
    };

    // Check if directory exists
    validation.exists = path.exists() && path.is_dir();
    if !validation.exists {
        validation.error = Some("Directory does not exist".to_string());
        return Ok(validation);
    }

    // Check write permissions
    let temp_file_path = path.join(".write_test_temp");
    match fs::write(&temp_file_path, b"test") {
        Ok(_) => {
            validation.has_write_permission = true;
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
            validation.available_space_gb = space as f64 / (1024.0 * 1024.0 * 1024.0);
            validation.has_space = space as f64 >= MIN_REQUIRED_SPACE;
            
            if !validation.has_space {
                validation.error = Some(format!(
                    "Insufficient disk space. Required: 256 GiB, Available: {:.2} GiB",
                    validation.available_space_gb
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
pub async fn check_directory_space(path: String, required_space_gb: Option<f64>) -> Result<(bool, f64), String> {
    let path = PathBuf::from(path);
    let required_space = required_space_gb.unwrap_or(256.0) * 1024.0 * 1024.0 * 1024.0; // Default to 256 GiB

    if !path.exists() || !path.is_dir() {
        return Err("Directory does not exist".to_string());
    }

    match get_available_space(&path) {
        Ok(space) => {
            let available_gb = space as f64 / (1024.0 * 1024.0 * 1024.0);
            Ok((space as f64 >= required_space, available_gb))
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

    let temp_file_path = path.join(".write_test_temp");
    match fs::write(&temp_file_path, b"test") {
        Ok(_) => {
            let _ = fs::remove_file(temp_file_path);
            Ok(true)
        }
        Err(_) => Ok(false),
    }
}

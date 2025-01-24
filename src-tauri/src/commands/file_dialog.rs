//! File Dialog Module
//! 
//! This module provides functionality for directory selection and validation in the application.
//! It includes commands for selecting directories, verifying their validity, and checking specific
//! directory properties like write permissions and available space.

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

/// Opens a directory selection dialog and returns the selected path
/// 
/// This command opens a native file dialog that allows the user to select a directory.
/// It uses a channel to handle the asynchronous nature of the dialog interaction.
/// 
/// # Returns
/// 
/// * `Ok(String)` - The selected directory path as a string
/// * `Err(String)` - Error message if directory selection fails or is cancelled
/// 
/// # Example
/// 
/// ```rust
/// let directory = select_directory().await?;
/// println!("Selected directory: {}", directory);
/// ```
#[tauri::command]
pub async fn select_directory() -> Result<String, String> {
    // Create a channel for communicating the selected directory
    let (sender, receiver) = std::sync::mpsc::channel();

    // Open the native file dialog for directory selection
    FileDialogBuilder::new().pick_folder(move |dir: Option<PathBuf>| {
        if let Some(dir) = dir {
            sender.send(dir.to_str().map(|s| s.to_string())).unwrap();
        } else {
            sender.send(None).unwrap();
        }
    });

    // Wait for and process the selection result
    let selected_dir = receiver
        .recv()
        .map_err(|_| "Failed to receive directory".to_string())?
        .ok_or("No directory selected".to_string())?;

    Ok(selected_dir)
}

/// Retrieves the available disk space for a given path
/// 
/// This helper function uses the sys_info crate to get disk information
/// and returns the available space in bytes.
/// 
/// # Arguments
/// 
/// * `_path` - PathBuf representing the directory to check
/// 
/// # Returns
/// 
/// * `Ok(u64)` - Available space in bytes
/// * `Err(String)` - Error message if disk info cannot be retrieved
fn get_available_space(_path: &PathBuf) -> Result<u64, String> {
    let disk_info = sys_info::disk_info()
        .map_err(|e| format!("Failed to get disk info: {}", e))?;
    
    // Convert KB to bytes (sys_info returns values in KB)
    let free_space = disk_info.free * 1024;
    Ok(free_space)
}

/// Performs comprehensive validation of a directory
/// 
/// This command checks multiple aspects of a directory:
/// - Existence
/// - Write permissions
/// - Available space (minimum 1GB required)
/// 
/// # Arguments
/// 
/// * `path` - String representing the directory path to validate
/// 
/// # Returns
/// 
/// * `Ok(DirectoryValidation)` - Validation results including all checks
/// * `Err(String)` - Error message if validation process fails
/// 
/// # Example
/// 
/// ```rust
/// let validation = verify_directory("/path/to/directory".to_string()).await?;
/// if validation.exists && validation.has_write_permission && validation.has_space {
///     println!("Directory is valid for use");
/// }
/// ```
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

/// Checks if a directory has sufficient free space
/// 
/// This command verifies if the specified directory has at least 1GB of free space.
/// 
/// # Arguments
/// 
/// * `path` - String representing the directory path to check
/// 
/// # Returns
/// 
/// * `Ok(bool)` - true if sufficient space is available, false otherwise
/// * `Err(String)` - Error message if space check fails
/// 
/// # Example
/// 
/// ```rust
/// if check_directory_space("/path/to/directory".to_string()).await? {
///     println!("Directory has sufficient space");
/// }
/// ```
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

/// Verifies write permissions for a directory
/// 
/// This command checks if the application has write permissions in the specified directory
/// by attempting to create and delete a temporary file.
/// 
/// # Arguments
/// 
/// * `path` - String representing the directory path to check
/// 
/// # Returns
/// 
/// * `Ok(bool)` - true if write permission exists, false otherwise
/// * `Err(String)` - Error message if permission check fails
/// 
/// # Example
/// 
/// ```rust
/// if check_write_permission("/path/to/directory".to_string()).await? {
///     println!("Directory is writable");
/// }
/// ```
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

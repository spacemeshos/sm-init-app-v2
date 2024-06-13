// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn run_postcli_command(args: Vec<String>) -> Result<String, String> {
    use std::process::Command;
    use std::env;
    use std::path::PathBuf;
    
    // Get the current working directory
    let mut path: PathBuf = env::current_dir().map_err(|e| e.to_string())?;
    // Append the relative path to the binary
    path.push("./postcli/postcli");

    // Convert the PathBuf to a string
    let postcli_path = path.to_str().ok_or("Invalid path")?;

    let output = Command::new(postcli_path)
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_run_postcli_command_with_absolute_path() {
        // Example test case with absolute path
        let mut path = env::current_dir().unwrap();
        path.push("/src-tauri/postcli/postcli");
        let postcli_path = path.to_str().unwrap();
        
        let args = vec![String::from("--version")];
        let output = run_postcli_command(args).unwrap();
        
        assert!(output.contains("postcli version"));
    }

    #[test]
    fn test_run_postcli_command_with_relative_path() {
        // Example test case with relative path
        let args = vec![String::from("--version")];
        let output = run_postcli_command(args).unwrap();
        
        assert!(output.contains("postcli version"));
    }

    #[test]
    fn test_run_postcli_command_invalid_argument() {
        // Example test case with invalid argument
        let args = vec![String::from("--invalid")];
        let output = run_postcli_command(args);
        
        assert!(output.is_err());
    }
}
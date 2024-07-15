use std::env;
use std::path::PathBuf;
use std::process::Command;

#[tauri::command]
pub fn run_postcli_command(args: Vec<String>) -> Result<String, String> {
    let mut path: PathBuf = env::current_dir().map_err(|e| e.to_string())?;
    path.push("./bin/postcli/postcli");

    let postcli_path = path.to_str().ok_or("Invalid path")?;

    let output = Command::new(postcli_path).args(&args).output();

    match output {
        Ok(output) => Ok(String::from_utf8_lossy(&output.stdout).to_string()),
        Err(e) => Err(e.to_string()),
    }
}


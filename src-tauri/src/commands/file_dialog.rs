use std::path::PathBuf;
use tauri::api::dialog::FileDialogBuilder;

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

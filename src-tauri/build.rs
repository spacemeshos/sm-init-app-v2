use std::env;
use std::path::Path;

fn main() {
    tauri_build::build();

    // Get the output directory where the binary will be built
    let out_dir = env::var("OUT_DIR").unwrap();
    let profile = env::var("PROFILE").unwrap();
    
    // Define source and destination paths for the profiler binary
    let src_profiler = Path::new("bin")
        .join("profiler")
        .join(if cfg!(target_os = "windows") {
            "profiler.exe"
        } else {
            "profiler"
        });

    let dest_profiler = Path::new(&out_dir)
        .join("..")
        .join("..")
        .join("..")
        .join(&profile)
        .join("resources")
        .join("bin")
        .join("profiler")
        .join(if cfg!(target_os = "windows") {
            "profiler.exe"
        } else {
            "profiler"
        });

    // Create the destination directory if it doesn't exist
    if let Some(parent) = dest_profiler.parent() {
        std::fs::create_dir_all(parent).unwrap();
    }

    // Copy the profiler binary if it exists
    if src_profiler.exists() {
        std::fs::copy(&src_profiler, &dest_profiler).unwrap_or_else(|e| {
            panic!("Failed to copy profiler binary: {}", e);
        });

        // Make the binary executable on Unix systems
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let mut perms = std::fs::metadata(&dest_profiler)
                .unwrap()
                .permissions();
            perms.set_mode(0o755);
            std::fs::set_permissions(&dest_profiler, perms).unwrap();
        }
    } else {
        println!("cargo:warning=Profiler binary not found at {:?}", src_profiler);
    }
}

use ocl::{Platform, Device, core};
use std::fmt;

#[derive(Debug)]
pub enum PostProviderError {
    PlatformListError(String),
    DeviceListError(String),
    DeviceInfoError(String),
    DeviceNotFound,
}

impl fmt::Display for PostProviderError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::PlatformListError(msg) => write!(f, "Failed to list platforms: {}", msg),
            Self::DeviceListError(msg) => write!(f, "Failed to list devices: {}", msg),
            Self::DeviceInfoError(msg) => write!(f, "Failed to get device info: {}", msg),
            Self::DeviceNotFound => write!(f, "Device not found"),
        }
    }
}

#[derive(serde::Serialize)]
pub struct Provider {
    id: u32,
    model: String,
    device_type: DeviceType,
    performance: Option<u64>,
}

#[derive(serde::Serialize)]
pub enum DeviceType {
    CPU = 0,
    GPU = 1,
}

fn get_device_type(device: &Device) -> Option<DeviceType> {
    match device.info(core::DeviceInfo::Type) {
        Ok(info) => {
            let type_str = info.to_string();
            if type_str.contains("GPU") {
                Some(DeviceType::GPU)
            } else {
                Some(DeviceType::CPU)
            }
        }
        Err(e) => {
            eprintln!("Failed to get device type: {}", e);
            None
        }
    }
}

fn get_device_name(device: &Device) -> Option<String> {
    match device.info(core::DeviceInfo::Name) {
        Ok(info) => Some(info.to_string()),
        Err(e) => {
            eprintln!("Failed to get device name: {}", e);
            None
        }
    }
}

#[tauri::command]
pub fn get_providers() -> Result<Vec<Provider>, String> {
    let mut providers = Vec::new();
    
    // Get all OpenCL platforms
    let platforms = Platform::list();
    
    for (platform_idx, platform) in platforms.iter().enumerate() {
        // Get all devices for this platform
        if let Ok(devices) = Device::list(platform, None) {
            for (device_idx, device) in devices.iter().enumerate() {
                // Get device type and name
                let Some(device_type) = get_device_type(device) else {
                    continue;
                };
                
                let Some(model) = get_device_name(device) else {
                    continue;
                };
                
                providers.push(Provider {
                    id: ((platform_idx << 16) | device_idx) as u32,
                    model,
                    device_type,
                    performance: None,
                });
            }
        }
    }
    
    Ok(providers)
}

fn get_device_info_u32(device: &Device, info: core::DeviceInfo) -> Result<u32, String> {
    match device.info(info) {
        Ok(info) => {
            let info_str = info.to_string();
            info_str.parse::<u32>().map_err(|e| format!("Failed to parse device info: {}", e))
        }
        Err(e) => Err(format!("Failed to get device info: {}", e))
    }
}

#[tauri::command]
pub fn benchmark_provider(provider_id: u32) -> Result<u64, String> {
    // Extract platform and device indices
    let platform_idx = (provider_id >> 16) as usize;
    let device_idx = (provider_id & 0xFFFF) as usize;
    
    // Get platforms
    let platforms = Platform::list();
    
    let platform = platforms.get(platform_idx)
        .ok_or_else(|| "Platform not found".to_string())?;
    
    // Get devices
    let devices = Device::list(platform, None)
        .map_err(|e| format!("Failed to list devices: {}", e))?;
    
    let device = devices.get(device_idx)
        .ok_or_else(|| "Device not found".to_string())?;
    
    // Get device's max compute units and frequency
    let compute_units = get_device_info_u32(device, core::DeviceInfo::MaxComputeUnits)?;
    let frequency = get_device_info_u32(device, core::DeviceInfo::MaxClockFrequency)?;
    
    // Convert to u64 and calculate rough performance estimate
    Ok(u64::from(compute_units) * u64::from(frequency) * 1000) // Convert to hashes/sec
}

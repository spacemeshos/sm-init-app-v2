import { invoke } from "@tauri-apps/api/tauri";
import { homeDir, join } from '@tauri-apps/api/path';

export interface DirectoryValidationResult {
  isValid: boolean;
  error?: string;
}

interface BackendValidation {
  exists: boolean;
  has_write_permission: boolean;
  has_space: boolean;
  error: string | null;
}

export const validateDirectory = async (
  path: string | null
): Promise<DirectoryValidationResult> => {
  if (!path) {
    return {
      isValid: false,
      error: "No directory selected",
    };
  }

  try {
    // Use the comprehensive backend validation
    const validation = await invoke<BackendValidation>("verify_directory", { path });

    // If there's an error message from the backend, use it
    if (validation.error) {
      return {
        isValid: false,
        error: validation.error,
      };
    }

    // Check all validation criteria
    if (!validation.exists) {
      return {
        isValid: false,
        error: "Selected directory does not exist",
      };
    }

    if (!validation.has_write_permission) {
      return {
        isValid: false,
        error: "Insufficient permissions for the selected directory",
      };
    }

    if (!validation.has_space) {
      return {
        isValid: false,
        error: "Not enough space in the selected directory (minimum 1GB required)",
      };
    }

    // All checks passed
    return {
      isValid: true,
    };
  } catch (err) {
    return {
      isValid: false,
      error: handleDirectoryError(err),
    };
  }
};

export const getDefaultDirectory = async (): Promise<string> => {
  try {
    const home = await homeDir();
    return await join(home, 'post', 'data');
  } catch (err) {
    console.error('Error getting default directory:', err);
    throw new Error('Failed to get default directory path');
  }
};

export const handleDirectoryError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific error cases
    if (error.message.includes("permission")) {
      return "Permission denied: Please select a directory you have access to";
    }
    if (error.message.includes("not found") || error.message.includes("no such file")) {
      return "Directory not found: Please select a valid directory";
    }
    if (error.message.includes("canceled") || error.message.includes("cancelled")) {
      return "Directory selection was cancelled";
    }
    if (error.message.includes("space")) {
      return "Not enough space in the selected directory (minimum 1GB required)";
    }
    if (error.message.includes("disk")) {
      return "Failed to check disk space. Please ensure the drive is accessible";
    }
    // Return the actual error message if none of the above cases match
    return `Error accessing directory: ${error.message}`;
  }
  // Generic error message as fallback
  return "An unknown error occurred while selecting the directory";
};

// Utility function to check directory space separately if needed
export const checkDirectorySpace = async (path: string): Promise<boolean> => {
  try {
    return await invoke<boolean>("check_directory_space", { path });
  } catch (err) {
    console.error("Error checking directory space:", err);
    return false;
  }
};

// Utility function to check write permissions separately if needed
export const checkWritePermission = async (path: string): Promise<boolean> => {
  try {
    return await invoke<boolean>("check_write_permission", { path });
  } catch (err) {
    console.error("Error checking write permission:", err);
    return false;
  }
};

/**
 * Utility function to shorten the directory path.
 * @param path - The original directory path.
 * @param maxLength - The maximum length of the shortened path.
 * @returns The shortened path.
 */
/**
 * Gets a formatted display string for the directory path
 * @param selectedDir - The selected custom directory path
 * @param defaultDir - The default directory path
 * @param maxLength - Maximum length for the shortened path
 * @returns Formatted directory display string
 */
export const getDirectoryDisplay = (
  selectedDir: string | null | undefined,
  defaultDir: string | null | undefined,
  maxLength: number = 35
): string => {
  if (selectedDir) {
    return `Custom: ${shortenPath(selectedDir, maxLength)}`;
  }
  return `Default: ${defaultDir ? shortenPath(defaultDir, maxLength) : "Loading..."}`;
};

export const shortenPath = (path: string, maxLength: number): string => {
  if (path.length <= maxLength) {
    return path;
  }

  const segments = path.split("/");
  const result = [];

  let currentLength = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Check if adding this segment exceeds the max length
    if (segment.length > 1 && currentLength + segment.length + 3 > maxLength) {
      result.push("...");
      result.push(segments[segments.length - 1]); // Always add the last segment
      break;
    } else {
      result.push(segment);
      currentLength += segment.length + 1; // Adding 1 for the slash
    }
  }

  return result.join("/");
};

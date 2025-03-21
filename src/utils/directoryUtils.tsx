/**
 * @fileoverview Utility functions for directory operations and validation
 * Handles directory path manipulation, validation, and error handling for the POS.
 * Integrates with Tauri backend for filesystem operations.
 */

import { homeDir, join } from '@tauri-apps/api/path';
import { invoke } from "@tauri-apps/api/tauri";

/**
 * Result of directory validation checks
 * @interface DirectoryValidationResult
 */
export interface DirectoryValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Backend validation response structure
 * Contains detailed validation results from Tauri backend
 * @interface BackendValidation
 */
interface BackendValidation {
  /** Whether the directory exists */
  exists: boolean;
  /** Whether we have write permissions */
  has_write_permission: boolean;
  /** Whether there's enough space (minimum 1GB for now, 
   * in a separate branch check-diskspace I tried to properly check the available space) */
  has_space: boolean;
  /** Error message if validation failed */
  error: string | null;
}

/**
 * Validates a directory for use in the POS system
 * Performs comprehensive checks including:
 * - Directory existence
 * - Write permissions
 * - Available space
 * @param {string | null} path - Directory path to validate
 * @returns {Promise<DirectoryValidationResult>} Validation result with any error messages
 */
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

/**
 * Gets the default directory path for POS data
 * Creates path under user's home directory: ~/post/data
 * @returns {Promise<string>} Default directory path
 * @throws {Error} If unable to determine home directory
 */
export const getDefaultDirectory = async (): Promise<string> => {
  try {
    const home = await homeDir();
    return await join(home, 'post', 'data');
  } catch (err) {
    console.error('Error getting default directory:', err);
    throw new Error('Failed to get default directory path');
  }
};

/**
 * Handles directory-related errors and provides user-friendly messages
 * Maps various error conditions to appropriate error messages
 * @param {unknown} error - Error object to handle
 * @returns {string} User-friendly error message
 */
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

/**
 * Checks if a directory has sufficient space
 * Can be used independently of full validation
 * @param {string} path - Directory path to check
 * @returns {Promise<boolean>} Whether directory has enough space
 */
export const checkDirectorySpace = async (path: string): Promise<boolean> => {
  try {
    return await invoke<boolean>("check_directory_space", { path });
  } catch (err) {
    console.error("Error checking directory space:", err);
    return false;
  }
};

/**
 * Checks if we have write permission for a directory
 * Can be used independently of full validation
 * @param {string} path - Directory path to check
 * @returns {Promise<boolean>} Whether we have write permission
 */
export const checkWritePermission = async (path: string): Promise<boolean> => {
  try {
    return await invoke<boolean>("check_write_permission", { path });
  } catch (err) {
    console.error("Error checking write permission:", err);
    return false;
  }
};

/**
 * Formats a directory path for display
 * Handles both custom and default directory paths
 * @param {string | null | undefined} selectedDir - Custom directory path if selected
 * @param {string | null | undefined} defaultDir - Default directory path
 * @param {number} maxLength - Maximum length for displayed path (default: 35)
 * @returns {string} Formatted path string with prefix indicating type (Custom/Default)
 */
export const getDirectoryDisplay = (
  selectedDir: string | null | undefined,
  defaultDir: string | null | undefined,
  maxLength: number = 35
): string => {
  if (selectedDir) {
    return `${shortenPath(selectedDir, maxLength)}`;
  }
  return defaultDir ? shortenPath(defaultDir, maxLength) : 'Loading...';
};

/**
 * Shortens a path to fit within specified length while maintaining readability
 * Preserves start and end of path, replacing middle sections with ellipsis
 * @param {string} path - Full path to shorten
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Shortened path with ellipsis if needed
 * @example
 * shortenPath("/very/long/path/to/file.txt", 20) => "/very/.../file.txt"
 */
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

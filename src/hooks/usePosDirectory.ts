import { open } from '@tauri-apps/api/dialog';
import { useState } from 'react';

import { useSettings } from '../state/SettingsContext';
import { handleDirectoryError, validateDirectory } from '../utils/directoryUtils';

export const usePosDirectory = () => {
  const { setSettings } = useSettings();
  // Track validation error state
  const [error, setError] = useState<string | null>(null);
  // Track directory validation progress
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Handles directory selection process
   *
   * Process:
   * 1. Opens native directory picker
   * 2. Validates selected directory
   * 3. Updates settings or shows error
   *
   * Error Handling:
   * - User cancellation
   * - Invalid directory
   * - Permission issues
   * - Space constraints
   */
  const selectDirectory = async () => {
    try {
      setIsValidating(true);
      setError(null);

      // Open native directory picker
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (!selected) {
        // If user cancels selection, clear selectedDir but keep defaultDir
        setSettings((prev) => ({ ...prev, selectedDir: undefined }));
        return;
      }

      const dir = selected as string;
      // Validate custom directory
      const validationResult = await validateDirectory(dir);

      if (validationResult.isValid) {
        // Update settings with validated directory
        setSettings((prev) => ({
          ...prev,
          selectedDir: dir,
        }));
      } else {
        // Handle validation failure
        setError(validationResult.error || 'Invalid directory selected');
        setSettings((prev) => ({ ...prev, selectedDir: undefined }));
      }
    } catch (err: unknown) {
      // Handle unexpected errors
      const errorMessage = handleDirectoryError(err);
      console.error('Directory selection failed:', errorMessage);
      setError(errorMessage);
      setSettings((prev) => ({ ...prev, selectedDir: undefined }));
    } finally {
      setIsValidating(false);
    }
  };

  return {
    selectDirectory,
    error,
    isValidating,
  };
}
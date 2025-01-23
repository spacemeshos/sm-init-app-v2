/**
 * @fileoverview Component for POS data directory selection
 * Provides interface for selecting and validating storage directory for POS data.
 * Handles both custom directory selection and default directory fallback.
 */

import { open } from '@tauri-apps/api/dialog';
import React, { useState } from 'react';

import { useSettings } from '../../state/SettingsContext';
import { SetupTileWrapper } from '../../styles/containers';
import {
  validateDirectory,
  handleDirectoryError,
  shortenPath,
} from '../../utils/directoryUtils';
import { Button } from '../button';
import {Tile} from '../tile';

/**
 * Directory Selection Component
 * 
 * Features:
 * - Native directory picker integration
 * - Directory validation
 * - Error handling
 * - Path display formatting
 * - Loading state management
 * 
 * The component supports:
 * 1. Using system's native directory picker
 * 2. Validating selected directory for:
 *    - Existence
 *    - Write permissions
 *    - Available space
 * 3. Falling back to default directory
 * 4. Displaying shortened paths for better UI
 */
export const SelectDirectory: React.FC = () => {
  const { settings, setSettings } = useSettings();
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
  const handleSelectDirectory = async () => {
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

  // Display either selected directory or default path
  const displayPath =
    settings.selectedDir || settings.defaultDir || 'Loading...';

  return (
    <SetupTileWrapper>
      <Tile
        heading="Select where to store POS data"
        footer={shortenPath(displayPath, 40)}
        errmsg={error ?? undefined}
        height={120}
      />
      <Button
        onClick={handleSelectDirectory}
        label={isValidating ? 'Validating...' : 'Choose custom directory'}
        width={320}
        disabled={isValidating}
      />
    </SetupTileWrapper>
  );
};

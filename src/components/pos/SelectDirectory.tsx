/**
 * @fileoverview Component for POS data directory selection
 * Provides interface for selecting and validating storage directory for POS data.
 * Handles both custom directory selection and default directory fallback.
 */

import { open } from '@tauri-apps/api/dialog';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSettings } from '../../state/SettingsContext';
import { SetupTileWrapper } from '../../styles/containers';
import { BodyText, Subheader } from '../../styles/texts';
import {
  validateDirectory,
  handleDirectoryError,
  shortenPath,
} from '../../utils/directoryUtils';
import { Button } from '../button';
import { Tile } from '../tile';

interface SelectDirectoryProps {
  variant?: 'compact' | 'full';
  width?: number;
  height?: number;
  showExplanation?: boolean;
}

const CompactWrapper = styled(SetupTileWrapper)`
  margin-top: 40px;
  height: 140px;
`;

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
 * Variants:
 * - full: Complete view with explanations and full-size elements
 * - compact: Condensed view for space-constrained contexts
 */
export const SelectDirectory: React.FC<SelectDirectoryProps> = ({
  variant = 'full',
  showExplanation = false,
}) => {
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

  const Wrapper = variant === 'compact' ? CompactWrapper : SetupTileWrapper;

  return (
    <Wrapper>
      <Tile
        heading="Select where to store POS data"
        footer={variant === 'compact' ? shortenPath(displayPath, 30) : ''}
        errmsg={error ?? undefined}
        height={250}
      />
      <Button
        onClick={handleSelectDirectory}
        label={isValidating ? 'Validating...' : 'Choose custom directory'}
        width={320}
        disabled={isValidating}
      />
      {variant === 'full' && showExplanation && (
        <>
          <Subheader text="Selected:" top={-180} />
          <Subheader text={shortenPath(displayPath, 50)} top={-160} />
          <BodyText
            text={`Select a reliable directory. If you don't choose one, the default directory will be used. 
              \nThe selected location should have appropriate permissions and meet space requirements.`}
          />
        </>
      )}
    </Wrapper>
  );
};

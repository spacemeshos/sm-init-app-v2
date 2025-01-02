import { open } from '@tauri-apps/api/dialog';
import React, { useState } from 'react';

import { useSettings } from '../../state/SettingsContext';
import {
  validateDirectory,
  handleDirectoryError,
  shortenPath,
} from '../../utils/directoryUtils';
import { Button } from '../button';
import {Tile} from '../tile';
import { SetupTileWrapper } from '../../styles/containers';

export const SelectDirectory: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSelectDirectory = async () => {
    try {
      setIsValidating(true);
      setError(null);

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
        setSettings((prev) => ({
          ...prev,
          selectedDir: dir,
        }));
      } else {
        setError(validationResult.error || 'Invalid directory selected');
        setSettings((prev) => ({ ...prev, selectedDir: undefined }));
      }
    } catch (err: unknown) {
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

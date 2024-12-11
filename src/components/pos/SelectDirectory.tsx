import React, { useEffect, useState } from "react";
import Tile from "../tile";
import { Button } from "../button";
import { BodyText, Subheader } from "../../styles/texts";
import { useSettings } from "../../state/SettingsContext";
import {
  validateDirectory,
  handleDirectoryError,
  shortenPath,
} from "../../utils/directoryUtils";
import { open } from "@tauri-apps/api/dialog";
import { homeDir, join } from '@tauri-apps/api/path';
import { BottomContainer, TileWrapper } from "./styles";

export const SelectDirectory: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const initDefaultPath = async () => {
      try {
        const home = await homeDir();
        const defaultDir = await join(home, 'post', 'data');
        
        // Store the default directory in settings
        setSettings(prev => ({
          ...prev,
          defaultDir: defaultDir
        }));
      } catch (err) {
        console.error('Error getting default directory:', err);
        setError('Failed to get default directory path');
      }
    };

    initDefaultPath();
  }, [setSettings]);

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
        setSettings(prev => ({ ...prev, selectedDir: undefined }));
        return;
      }

      const dir = selected as string;
      
      // Validate custom directory
      const validationResult = await validateDirectory(dir);

      if (validationResult.isValid) {
        setSettings(prev => ({
          ...prev,
          selectedDir: dir
        }));
      } else {
        setError(validationResult.error || "Invalid directory selected");
        setSettings(prev => ({ ...prev, selectedDir: undefined }));
      }
    } catch (err: unknown) {
      const errorMessage = handleDirectoryError(err);
      console.error("Directory selection failed:", errorMessage);
      setError(errorMessage);
      setSettings(prev => ({ ...prev, selectedDir: undefined }));
    } finally {
      setIsValidating(false);
    }
  };

  // Display either selected directory or default path
  const displayPath = settings.selectedDir || settings.defaultDir || "Loading...";

  return (
    <BottomContainer>
      <TileWrapper width={500}>
        <Tile
          heading="Select where to store POS data"
          subheader={settings.selectedDir ? "Custom directory selected" : "Default directory"}
          errmsg={error ?? undefined}
        />
        <Subheader text="Path:" />
        <BodyText text={shortenPath(displayPath, 30)} />
        <Button
          onClick={handleSelectDirectory}
          label={isValidating ? "Validating..." : "Choose custom directory"}
          width={320}
          top={30}
          disabled={isValidating}
        />
      </TileWrapper>
    </BottomContainer>
  );
};

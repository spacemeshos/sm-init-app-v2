import { readTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

import { SizeConstants } from '../Shared/Constants';
import { useSettings } from '../state/SettingsContext';
import { ParsedMetadata, PosMetadata } from '../types/metadata';
import { base64ToHex } from '../utils/hexUtils';

import { usePosDirectory } from './usePosDirectory';

export const useMetadataFile = () => {
  const { settings, setSettings } = useSettings();

  // Modal for the case when metadata file is found
  const [error, setError] = useState('');
  const [isOpen, setIsOpenModal] = useState(false);
  // Metadata from the metadata file
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);

  const { selectDirectory } = usePosDirectory();

  useEffect(() => {
    const dir = settings.selectedDir || settings.defaultDir;
    if (dir) {
      (async () => {
        // Check for metadata file to load settings if exist
        try {
          const metadataPath = await join(dir, 'postdata_metadata.json');
          const metadataContent = await readTextFile(metadataPath);
          const parsedMetadata: PosMetadata = JSON.parse(metadataContent);
          const metadata: ParsedMetadata = {
            atxId: base64ToHex(parsedMetadata.CommitmentAtxId).toLowerCase(),
            publicKey: base64ToHex(parsedMetadata.NodeId).toLowerCase(),
            numUnits: parsedMetadata.NumUnits,
            maxFileSize: parsedMetadata.MaxFileSize / 1024 / 1024,
          };

          // Validate labelsPerUnit
          if (parsedMetadata.LabelsPerUnit !== SizeConstants.DEFAULT_LABELS_PER_UNIT) {
            setError(
              `LabelsPerUnit mismatch, got ${parsedMetadata.LabelsPerUnit}, expected ${SizeConstants.DEFAULT_LABELS_PER_UNIT}. Please select another directory.`
            );
            setSettings((prev) => ({ ...prev, selectedDir: undefined }));
            setIsOpenModal(true);
            return;
          }
          // Do not bother User if metadata is the same (or already loaded)
          if (
            settings.atxId === metadata.atxId &&
            settings.publicKey === metadata.publicKey &&
            settings.numUnits === metadata.numUnits &&
            settings.maxFileSize === metadata.maxFileSize
          ) return;

          setMetadata(metadata);
          setIsOpenModal(true);
        } catch {
          console.log('No metadata file found');
        }
      })();
    }
  }, [
    setSettings,
    settings.selectedDir,
    settings.atxId,
    settings.defaultDir,
    settings.maxFileSize,
    settings.numUnits,
    settings.publicKey,
  ]);

  // Load metadata from the selected directory
  const handleLoadMetadata = async () => {
    if (metadata) {
      setSettings((prev) => ({
        ...prev,
        ...metadata,
      }));
    }
    setIsOpenModal(false);
  };
  const handleRejectMetadata = () => {
    setIsOpenModal(false);
    selectDirectory();
  };

  return {
    error,
    isOpen,
    metadata,
    handleLoadMetadata,
    handleRejectMetadata,
  };
};

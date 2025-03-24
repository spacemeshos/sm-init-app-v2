import { readTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

import { SizeConstants } from '../Shared/Constants';
import { useSettings } from '../state/SettingsContext';
import { PosMetadata } from '../types/metadata';
import { validateDirectory } from '../utils/directoryUtils';
import { base64ToHex } from '../utils/hexUtils';
import { usePosDirectory } from './usePosDirectory';

export const useMetadataFile = () => {
  const { settings, setSettings } = useSettings();

  // Modal for the case when metadata file is found
  const [error, setError] = useState('');
  const [isOpen, setIsOpenModal] = useState(false);
  // Metadata from the metadata file
  const [metadata, setMetadata] = useState<PosMetadata | null>(null);

  const { selectDirectory } = usePosDirectory();

  useEffect(() => {
    const dir = settings.selectedDir || settings.defaultDir;
    if (dir) {
      (async () => {
        // Check for metadata file to load settings if exist
        try {
          const metadataPath = await join(dir, 'postdata_metadata.json');
          const metadataContent = await readTextFile(metadataPath);
          console.log('metaDataContent', metadataContent);
          const parsedMetadata: PosMetadata = JSON.parse(metadataContent);

          console.log('parsedMetadata', parsedMetadata);
          // Validate labelsPerUnit
          if (parsedMetadata.LabelsPerUnit !== SizeConstants.DEFAULT_LABELS_PER_UNIT) {
            setError(
              `LabelsPerUnit mismatch, got ${parsedMetadata.LabelsPerUnit}, expected ${SizeConstants.DEFAULT_LABELS_PER_UNIT}. Please select another directory.`
            );
            setSettings((prev) => ({ ...prev, selectedDir: undefined }));
            setIsOpenModal(true);
            return;
          }
          setMetadata(parsedMetadata);
          setIsOpenModal(true);
        } catch {
          console.log('No metadata file found');
        }
      })();
    }
  }, [settings.selectedDir]);

  // Load metadata from the selected directory
  const handleLoadMetadata = async () => {
    if (metadata) {
      setSettings((prev) => ({
        ...prev,
        atxId: base64ToHex(metadata.CommitmentAtxId).toLowerCase(),
        publicKey: base64ToHex(metadata.NodeId).toLowerCase(),
        numUnits: metadata.NumUnits,
        maxFileSize: metadata.MaxFileSize / 1024 / 1024,
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

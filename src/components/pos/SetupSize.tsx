/**
 * @fileoverview Component for configuring POS data size parameters
 * Handles space unit allocation and file size settings with real-time
 * calculations and validation. Provides visual feedback for size implications.
 */

import React from 'react';

import { SizeConstants } from '../../Shared/Constants';
import { useSettings } from '../../state/SettingsContext';
import { SetupContainer, SetupTileWrapper } from '../../styles/containers';
import { BodyText } from '../../styles/texts';
import { calculateTotalSize, calculateNumFiles } from '../../utils/sizeUtils';
import CustomNumberInput from '../input';
import { Tile } from '../tile';

/**
 * Size Configuration Component
 *
 * Features:
 * - Space unit allocation configuration
 * - Maximum file size settings
 * - Real-time size calculations
 * - Input validation and constraints
 * - Visual feedback
 *
 * The component manages two key aspects:
 * 1. Space Units:
 *    - Number of units to allocate
 *    - Minimum unit requirement
 *    - Total size calculation
 *
 * 2. File Size:
 *    - Maximum size per file
 *    - Number of files calculation
 *    - Size constraints and validation
 */
export const SetupDataSize: React.FC = () => {
  const { settings, setSettings } = useSettings();

  return (
    <SetupContainer>
      {/* Space Units Configuration */}
      <SetupTileWrapper>
        <Tile
          heading="Select Space Units"
          subheader={`${
            settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS
          } Space Units (${calculateTotalSize(settings.numUnits)})`}
          footer={`1 Space Unit = ${SizeConstants.UNIT_SIZE_GIB} GiB (Minimum ${SizeConstants.DEFAULT_NUM_UNITS})`}
          width={700}
          height={300}
        >
          {/* Space Units Input
                - Minimum: DEFAULT_NUM_UNITS (cannot allocate less)
                - Step: 1 unit at a time
                - Updates total size calculation on change
            */}
          <CustomNumberInput
            min={SizeConstants.DEFAULT_NUM_UNITS}
            step={1}
            value={settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS}
            onChange={(val) =>
              setSettings((prev) => ({ ...prev, numUnits: val }))
            }
            width={150}
            height={60}
          />
        </Tile>
          <BodyText
            text={`Choose here the total amount of POS data to generate. The more you allocate, the bigger the rewards. 
              \nThe POS data will be generated in multiple files. The size of each file is determined by the maximum file size option in advanced settings. 
              \nNote: Consider your proving capabilities. Too much data may be impossible to prove on time.`}
          />
      </SetupTileWrapper>
    </SetupContainer>
  );
};

export const SetupFileSize: React.FC = () => {
  const { settings, setSettings } = useSettings();

  return (
    <SetupContainer>
      {/* File Size Configuration */}
      <SetupTileWrapper>
        <Tile
          heading="Max File Size in Mebibytes"
          subheader={`${calculateNumFiles(
            settings.numUnits,
            settings.maxFileSize || SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
          )} files will be generated`}
          footer={`Default: ${SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB} MiB (${SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB / 1024} GiB)`}
          width={500}
          height={300}
        >
          {/* File Size Input
                - Minimum: 1 MiB (cannot have empty files)
                - Maximum: 8192 MiB (8 GiB) for practical file handling, but fs limitations to be considered for better boundries
                - Step: 1 MiB at a time
                - Updates file count calculation on change
            */}
          <CustomNumberInput
            min={1}
            max={8192}
            step={1}
            value={
              settings.maxFileSize || SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
            }
            onChange={(val) =>
              setSettings((prev) => ({ ...prev, maxFileSize: val }))
            }
            width={150}
            height={60}
          />
        </Tile>
          <BodyText
            text={`The POS data will be split across multiple smaller files. You can choose here the size of these files. 
              \nNote: File size is limited to 8 GiB for practical reasons. Please consider filesystem limitations for larger files.`}
          />
      </SetupTileWrapper>
    </SetupContainer>
  );
};

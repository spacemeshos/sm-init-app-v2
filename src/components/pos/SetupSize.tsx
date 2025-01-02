import React from "react";

import { useSettings } from "../../state/SettingsContext";
import CustomNumberInput from "../input";
import {Tile} from "../tile";
import { calculateTotalSize, calculateNumFiles } from "../../utils/sizeUtils";

import {
  SetupContainer,
  SetupTileWrapper,
} from "../../styles/containers";

export const SetupSize: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const MIN_SPACE_UNITS = 4;
  const DEFAULT_MAX_FILE_SIZE_MIB = 4096;

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="Select Space Units"
          subheader={`${
            settings.numUnits || 4
          } Space Units (${calculateTotalSize(settings.numUnits)})`}
          footer="1 Space Unit = 64 GiB (Minimum 4)"
          width={250}
          height={400}
        />
          <>
            <CustomNumberInput
              min={MIN_SPACE_UNITS}
              step={1}
              value={settings.numUnits || MIN_SPACE_UNITS}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, numUnits: val }))
              }
            />
          </>
      </SetupTileWrapper>

      <SetupTileWrapper>
        <Tile
          heading="Max File Size in Mebibytes"
          subheader={`${calculateNumFiles(
            settings.numUnits,
            settings.maxFileSize || DEFAULT_MAX_FILE_SIZE_MIB
          )} files will be generated`}
          footer="Default: 4096 MiB (4 GiB)"
          width={250}
          height={400}
        />
          <>
            <CustomNumberInput
              min={1}
              max={8192}
              step={1}
              value={settings.maxFileSize || DEFAULT_MAX_FILE_SIZE_MIB}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, maxFileSize: val }))
              }
            />
          </>
      </SetupTileWrapper>
    </SetupContainer>
  );
};

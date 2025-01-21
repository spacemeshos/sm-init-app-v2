import React from "react";

import { SizeConstants } from "../../Shared/Constants";
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

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="Select Space Units"
          subheader={`${
            settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS
          } Space Units (${calculateTotalSize(settings.numUnits)})`}
          footer={`1 Space Unit = ${SizeConstants.UNIT_SIZE_GIB} GiB (Minimum ${SizeConstants.DEFAULT_NUM_UNITS})`}
          width={250}
          height={400}
        />
          <>
            <CustomNumberInput
              min={SizeConstants.DEFAULT_NUM_UNITS}
              step={1}
              value={settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS}
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
            settings.maxFileSize || SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
          )} files will be generated`}
          footer={`Default: ${SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB} MiB (${SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB / 1024} GiB)`}
          width={250}
          height={400}
        />
          <>
            <CustomNumberInput
              min={1}
              max={8192}
              step={1}
              value={settings.maxFileSize || SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, maxFileSize: val }))
              }
            />
          </>
      </SetupTileWrapper>
    </SetupContainer>
  );
};

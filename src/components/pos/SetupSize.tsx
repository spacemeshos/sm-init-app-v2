import React, { useState } from "react";

import { useSettings } from "../../state/SettingsContext";
import { SaveButton, CancelButton } from "../button";
import CustomNumberInput from "../input";
import Tile from "../tile";
import { calculateTotalSize, calculateNumFiles } from "../../utils/sizeUtils";

import {
  SetupContainer,
  SetupTileWrapper,
  SelectedValue,
} from "../../styles/containers";

export const SetupSize: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isSpaceUnitsVisible, setIsSpaceUnitsVisible] = useState(true);
  const [isMaxFileSizeVisible, setIsMaxFileSizeVisible] = useState(true);
  const MIN_SPACE_UNITS = 4;
  const DEFAULT_MAX_FILE_SIZE_MIB = 4096;

  const handleSaveSpaceUnits = () => {
    setIsSpaceUnitsVisible(false);
  };

  const handleCancelSpaceUnits = () => {
    setSettings((prev) => ({ ...prev, numUnits: MIN_SPACE_UNITS }));
    setIsSpaceUnitsVisible(true);
  };

  const handleSaveMaxFileSize = () => {
    setIsMaxFileSizeVisible(false);
  };

  const handleCancelMaxFileSize = () => {
    setSettings((prev) => ({
      ...prev,
      maxFileSize: DEFAULT_MAX_FILE_SIZE_MIB,
    }));
    setIsMaxFileSizeVisible(true);
  };

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
        {isSpaceUnitsVisible ? (
          <>
            <CustomNumberInput
              min={MIN_SPACE_UNITS}
              step={1}
              value={settings.numUnits || MIN_SPACE_UNITS}
              onChange={(val) =>
                setSettings((prev) => ({ ...prev, numUnits: val }))
              }
            />
            <SaveButton left={55} onClick={handleSaveSpaceUnits} />
            <CancelButton left={45} onClick={handleCancelSpaceUnits} />
          </>
        ) : (
          <>
            <SelectedValue>
              {settings.numUnits || MIN_SPACE_UNITS}
            </SelectedValue>
            <CancelButton left={50} onClick={handleCancelSpaceUnits} />
          </>
        )}
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
        {isMaxFileSizeVisible ? (
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
            <SaveButton left={55} onClick={handleSaveMaxFileSize} />
            <CancelButton left={45} onClick={handleCancelMaxFileSize} />
          </>
        ) : (
          <>
            <SelectedValue>
              {settings.maxFileSize || DEFAULT_MAX_FILE_SIZE_MIB}
            </SelectedValue>
            <CancelButton left={50} onClick={handleCancelMaxFileSize} />
          </>
        )}
      </SetupTileWrapper>
    </SetupContainer>
  );
};

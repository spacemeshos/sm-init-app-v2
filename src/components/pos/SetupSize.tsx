import React, { useState } from "react";

import { useSettings } from "../../state/SettingsContext";
import { SaveButton, CancelButton } from "../button";
import CustomNumberInput from "../input";
import Tile from "../tile";

import { BottomContainer, TileWrapper, SelectedValue } from "./styles";

export const SetupSize: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isSpaceUnitsVisible, setIsSpaceUnitsVisible] = useState(true);
  const MIN_SPACE_UNITS = 4;

  const handleSaveSpaceUnits = () => {
    setIsSpaceUnitsVisible(false);
  };

  const handleCancelSpaceUnits = () => {
    setSettings((prev) => ({ ...prev, numUnits: MIN_SPACE_UNITS }));
    setIsSpaceUnitsVisible(true);
  };

  return (
    <BottomContainer>
      <TileWrapper>
        <Tile
          heading="Select Space Units"
          subheader="1 Space Unit = 64 GiB"
          footer="Minimum: 4 Space Units (256 GiB)"
        />
        {isSpaceUnitsVisible ? (
          <>
            <CustomNumberInput
              min={MIN_SPACE_UNITS}
              max={999}
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
      </TileWrapper>
    </BottomContainer>
  );
};

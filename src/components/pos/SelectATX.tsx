import React, { useState } from "react";

import { useSettings } from "../../state/SettingsContext";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { HexInput } from "../input";
import Tile from "../tile";

import { BottomContainer, TileWrapper } from "./styles";

export const SelectATX: React.FC = () => {
  const { setSettings } = useSettings();
  const [atxId, setAtxId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAtxIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value === "" || isValidHex(value)) {
      setAtxId(value);
      setSettings((prev) => ({ ...prev, atxId: value }));
      setError(null);
    } else {
      setError("ATX ID must be a valid hexadecimal value");
    }
  };

  const displayValue = atxId ? `ID: ${truncateHex(atxId, 6)}` : "Enter your ATX ID";

  return (
    <BottomContainer>
      <TileWrapper>
        <Tile
          heading="ATX ID"
          subheader="(Optional)"
          footer={displayValue}
          errmsg={error ?? undefined}
        />
        <HexInput
          type="text"
          value={atxId}
          onChange={handleAtxIdChange}
          placeholder="Enter ATX ID (hex)"
          maxLength={64}
          fontSize={12}
        />
      </TileWrapper>
    </BottomContainer>
  );
};

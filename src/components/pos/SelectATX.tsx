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
    setAtxId(value);

    if (value === "") {
      setError(null);
      setSettings((prev) => ({ ...prev, atxId: undefined }));
    } else if (!isValidHex(value, 64)) {
      setError("ATX ID must be a 64-character hexadecimal string");
      setSettings((prev) => ({ ...prev, atxId: undefined }));
    } else {
      setError(null);
      setSettings((prev) => ({ ...prev, atxId: value }));
    }
  };

  const displayValue = atxId && !error 
    ? `ATX ID: ${truncateHex(atxId, 8)}`
    : "ATX ID is required to generate POS data";

  return (
    <BottomContainer>
      <TileWrapper>
        <Tile
          heading="ATX ID"
          subheader="Required for POS data generation"
          footer={displayValue}
          errmsg={error ?? undefined}
        />
        <HexInput
          type="text"
          value={atxId}
          onChange={handleAtxIdChange}
          placeholder="Enter ATX ID (required, 64-char hex)"
          maxLength={64}
          fontSize={12}
          width={300}
          className={error ? "error" : ""}
        />
      </TileWrapper>
    </BottomContainer>
  );
};

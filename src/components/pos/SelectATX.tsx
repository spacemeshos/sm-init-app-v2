import React from "react";

import { useSettings } from "../../state/SettingsContext";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { HexInput } from "../input";
import {Tile} from "../tile";

import { SetupContainer, SetupTileWrapper } from "../../styles/containers";

export const SelectATX: React.FC = () => {
  const { settings, setSettings } = useSettings();

  const handleAtxIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    if (value === "") {
      setSettings((prev) => ({ 
        ...prev, 
        atxId: undefined,
        atxIdSource: 'api',
        atxIdError: undefined 
      }));
    } else if (!isValidHex(value, 64)) {
      setSettings((prev) => ({ 
        ...prev, 
        atxId: undefined,
        atxIdSource: 'manual',
        atxIdError: "ATX ID must be a 64-character hexadecimal string"
      }));
    } else {
      setSettings((prev) => ({ 
        ...prev, 
        atxId: value,
        atxIdSource: 'manual',
        atxIdError: undefined
      }));
    }
  };

  const displayValue = settings.atxId
    ? `ATX ID: ${truncateHex(settings.atxId, 8)} (${settings.atxIdSource === 'manual' ? 'Manual Input' : 'Auto-fetched'})`
    : "ATX ID will be auto-fetched";

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="ATX ID (Advanced)"
          subheader="Automatically managed. But you can override it here."
          footer={displayValue}
          errmsg={settings.atxIdError}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <HexInput
            type="text"
            value={settings.atxId || ''}
            onChange={handleAtxIdChange}
            placeholder="Leave empty to use auto-fetched ATX ID"
            maxLength={64}
            fontSize={12}
            width={300}
            className={settings.atxIdError ? "error" : ""}
          />
        </div>
      </SetupTileWrapper>
    </SetupContainer>
  );
};

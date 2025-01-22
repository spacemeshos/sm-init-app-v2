import React, { useState } from "react";

import { useSettings } from "../../state/SettingsContext";
import { SetupContainer, SetupTileWrapper } from "../../styles/containers";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { HexInput } from "../input";
import {Tile} from "../tile";


export const SelectIdentity: React.FC = () => {
  const { setSettings } = useSettings();
  const [publicKey, setPublicKey] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handlePublicKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.toLowerCase();
    setPublicKey(value);

    if (value === "") {
      setError(undefined);
      setSettings((prev) => ({ ...prev, publicKey: undefined }));
    } else if (!isValidHex(value, 64)) {
      setError("Public key must be a 64-character hexadecimal string");
      setSettings((prev) => ({ ...prev, publicKey: undefined }));
    } else {
      setError(undefined);
      setSettings((prev) => ({
        ...prev,
        publicKey: value,
      }));
    }
  };

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="Enter your Smesher Identity"
          subheader={
            publicKey && !error
              ? `Custom ID will be used: ${truncateHex(publicKey, 8)}`
              : "If no Identity provided, a new one will be created automatically"
          }
          errmsg={error ?? undefined}
          width={600}
        />
        <HexInput
          type="text"
          fontSize={12}
          value={publicKey}
          onChange={handlePublicKeyChange}
          placeholder="Enter your Public Key (hex, optional)"
          maxLength={64}
          width={300}
          className={error ? "error" : ""}
        />
      </SetupTileWrapper>
    </SetupContainer>
  );
};

import React, { useState } from "react";
import Tile from "../tile";
import { Button } from "../button";
import { HexInput } from "../input";
import { useSettings } from "../../state/SettingsContext";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { open } from "@tauri-apps/api/dialog";
import { BottomContainer, TileWrapper } from "./styles";

export const SelectIdentity: React.FC = () => {
  const { setSettings } = useSettings();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [privateKeyError, setPrivateKeyError] = useState<string | null>(null);

  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Identity Key",
            extensions: ["key"],
          },
        ],
      });

      if (selected && typeof selected === "string") {
        const fileName = selected.split("/").pop() || selected;
        setSelectedFile(fileName);
        setSettings((prev) => ({
          ...prev,
          identityFile: selected,
          privateKey: undefined,
        }));
        setError(null);
        setPrivateKey("");
        setPrivateKeyError(null);
      }
    } catch (err) {
      console.error("Error selecting file:", err);
      setError("Failed to select file");
    }
  };

  const handlePrivateKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.toLowerCase();
    setPrivateKey(value);

    if (value === "") {
      setPrivateKeyError(null);
      setSettings((prev) => ({ ...prev, privateKey: undefined }));
    } else if (!isValidHex(value, 64)) {
      setPrivateKeyError(
        "Private key must be a 64-character hexadecimal string"
      );
      setSettings((prev) => ({ ...prev, privateKey: undefined }));
    } else {
      setPrivateKeyError(null);
      setSettings((prev) => ({
        ...prev,
        privateKey: value,
        identityFile: undefined,
      }));
      setSelectedFile(null);
      setError(null);
    }
  };

  const displayValue = privateKey 
    ? `Key: ${truncateHex(privateKey, 8)}` 
    : (selectedFile || "Otherwise, a new ID will be created");

  return (
    <BottomContainer>
      <TileWrapper width={660}>
        <Tile
          heading="Identity"
          subheader="Enter your Private Key or select identity file"
          footer={displayValue}
          errmsg={error ?? privateKeyError ?? undefined}
        />
        <HexInput
          type="text"
          fontSize={12}
          value={privateKey}
          onChange={handlePrivateKeyChange}
          placeholder="Enter private key (hex)"
          maxLength={64}
          className={privateKeyError ? "error" : ""}
        />
        <Button
          onClick={handleFileSelect}
          label={selectedFile ? "Change File" : "Select identity.key File"}
          width={320}
          top={70}
        />
      </TileWrapper>
    </BottomContainer>
  );
};

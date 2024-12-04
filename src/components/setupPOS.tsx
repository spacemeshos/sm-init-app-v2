import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { Button, CancelButton, SaveButton } from "./button";
import CustomNumberInput, { HexInput } from "./input";
import { BodyText, ErrorMessage, Subheader } from "../styles/texts";
import { invoke } from "@tauri-apps/api";
import { useSettings } from "../state/SettingsContext";
import { FindProviders } from "../utils/parseResponse";
import {
  validateDirectory,
  handleDirectoryError,
  shortenPath,
} from "../utils/directoryUtils";
import { truncateHex, isValidHex } from "../utils/hexUtils";
import POSSummary from "./POSSummary";
import { open } from "@tauri-apps/api/dialog";

const BottomContainer = styled.div`
  height: 80%;
  width: 100%;
  position: absolute;
  top: 70px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
`;

const TileWrapper = styled.div<{
  width?: number;
}>`
  height: 90%;
  width: ${({ width }) => width || 450}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
`;

const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;

const SelectDirectory: React.FC = () => {
  const { setSettings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSelectDirectory = async () => {
    try {
      setIsValidating(true);
      setError(null);

      const dir = await invoke<string>("select_directory");

      // Validate the selected directory
      const validationResult = await validateDirectory(dir);

      if (!validationResult.isValid) {
        setError(validationResult.error || "Invalid directory selected");
        return;
      }

      setSelectedDir(dir);
      setSettings((settings) => ({
        ...settings,
        selectedDir: dir,
      }));
    } catch (err: unknown) {
      const errorMessage = handleDirectoryError(err);
      console.error("Directory selection failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <BottomContainer>
      <TileWrapper width={500}>
        <Tile
          heading="Select where to store POS data"
          errmsg={error ?? undefined}
        />
        {selectedDir && (
          <>
            <Subheader text="Selected:" />
            <BodyText text={`${shortenPath(selectedDir, 30)}`} />
          </>
        )}
        <Button
          onClick={handleSelectDirectory}
          label={isValidating ? "Validating..." : "Choose directory"}
          width={320}
          top={30}
          disabled={isValidating}
        />
      </TileWrapper>
    </BottomContainer>
  );
};

const SetupSize: React.FC = () => {
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

const SetupProving: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);
  const [maxCores, setMaxCores] = useState<number>(0);
  const DEFAULT_NONCES = 288;

  const handleSaveCPU = () => {
    setIsCpuInputVisible(false);
  };

  const handleSaveNonces = () => {
    setIsNoncesInputVisible(false);
  };

  const handleCancelCPU = () => {
    const defaultCores = Math.floor((3 / 4) * maxCores);
    setSettings((prev) => ({ ...prev, numCores: defaultCores }));
    setIsCpuInputVisible(true);
  };

  const handleCancelNonces = () => {
    setSettings((prev) => ({ ...prev, numNonces: DEFAULT_NONCES }));
    setIsNoncesInputVisible(true);
  };

  useEffect(() => {
    const fetchCpuCores = async () => {
      try {
        const cores = await invoke<number>("get_cpu_cores");
        setMaxCores(cores);
        const defaultCores = Math.floor((3 / 4) * cores);
        setSettings((prev) => ({ ...prev, numCores: defaultCores }));
      } catch (error) {
        console.error("Error fetching CPU cores:", error);
      }
    };

    fetchCpuCores();
  }, [setSettings]);

  const InputSection: React.FC<{
    heading: string;
    footer: string;
    isVisible: boolean;
    value: number;
    min: number;
    max: number;
    step: number;
    handleSave: () => void;
    handleCancel: () => void;
    onChange: (val: number) => void;
  }> = ({
    heading,
    footer,
    isVisible,
    value,
    min,
    max,
    step,
    handleSave,
    handleCancel,
    onChange,
  }) => (
    <TileWrapper>
      <Tile heading={heading} footer={footer} />
      {isVisible ? (
        <>
          <CustomNumberInput
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
          />
          <SaveButton left={55} onClick={handleSave} />
          <CancelButton left={45} onClick={handleCancel} />
        </>
      ) : (
        <>
          <SelectedValue>{value}</SelectedValue>
          <CancelButton left={50} onClick={handleCancel} />
        </>
      )}
    </TileWrapper>
  );

  return (
    <BottomContainer>
      <InputSection
        heading="Select number of CPU cores"
        footer={`Default: ${Math.floor(
          (3 / 4) * maxCores
        )} cores (3/4 of total cores)`}
        isVisible={isCpuInputVisible}
        value={settings.numCores || Math.floor((3 / 4) * maxCores)}
        min={1}
        max={maxCores}
        step={1}
        handleSave={handleSaveCPU}
        handleCancel={handleCancelCPU}
        onChange={(val) => setSettings((prev) => ({ ...prev, numCores: val }))}
      />
      <InputSection
        heading="Select number of Nonces"
        footer={`Default: ${DEFAULT_NONCES} nonces`}
        isVisible={isNoncesInputVisible}
        value={settings.numNonces || DEFAULT_NONCES}
        min={16}
        max={9999}
        step={16}
        handleSave={handleSaveNonces}
        handleCancel={handleCancelNonces}
        onChange={(val) => setSettings((prev) => ({ ...prev, numNonces: val }))}
      />
    </BottomContainer>
  );
};

interface Props {
  isOpen: boolean;
}

const SetupGPU: React.FC<Props> = ({ isOpen }) => {
  const { setSettings } = useSettings();
  const { run, response, loading, error } = FindProviders();
  const [selectedProvider, setSelectedProvider] = useState<number>(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const detectProviders = async () => {
        await run(["-printProviders"]);
        setHasInitialized(true);
      };
      detectProviders();
    }
  }, [isOpen, hasInitialized]);

  useEffect(() => {
    if (response && response.length > 0) {
      setSelectedProvider(0);
      setSettings((prev) => ({ ...prev, provider: 0 }));
    }
  }, [response, setSettings]);

  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

  const handleProviderSelect = (providerId: number) => {
    setSelectedProvider(providerId);
    setSettings((prev) => ({ ...prev, provider: providerId }));
  };

  const createTile = (processor: {
    ID: number;
    Model: string;
    DeviceType: string;
  }) => {
    const isFastest = processor.ID === 0;
    const isSelected = processor.ID === selectedProvider;

    return (
      <TileWrapper width={350} key={processor.ID}>
        <Tile
          heading={processor.Model}
          subheader={`${processor.DeviceType}${isFastest ? " (Fastest)" : ""}`}
          footer={isSelected ? "Selected" : "Click to select"}
          onClick={() => handleProviderSelect(processor.ID)}
          selected={isSelected}
        />
      </TileWrapper>
    );
  };

  if (!isOpen) return null;

  return (
    <BottomContainer>
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error detecting processors:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text="No processors detected" />
      )}
    </BottomContainer>
  );
};

const SelectIdentity: React.FC = () => {
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

  const displayValue = privateKey ? `Key: ${truncateHex(privateKey, 8)}` : (selectedFile || "Otherwise, a new ID will be created");

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

const SelectATX: React.FC = () => {
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
        />
      </TileWrapper>
    </BottomContainer>
  );
};

const SetupSummary: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return <POSSummary onProceed={onStart} />;
};

export {
  SelectDirectory,
  SetupSize,
  SetupProving,
  SetupGPU,
  SelectIdentity,
  SelectATX,
  SetupSummary,
};

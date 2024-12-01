import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { Button, CancelButton, SaveButton, TooltipButton } from "./button";
import CustomNumberInput from "./input";
import { ErrorMessage, Subheader } from "../styles/texts";
import size from "../assets/duplicate.png";
import cpu from "../assets/cpu.png";
import gpu from "../assets/graphics-card.png";
import key from "../assets/key.png";
import Frame from "./frames";
import rocket from "../assets/rocket.png";
import folder from "../assets/folder.png";
import { invoke } from "@tauri-apps/api";
import { useSettings } from "../state/SettingsContext";
import { FindProviders } from "../utils/parseResponse";
import { shortenPath } from "../utils/pathUtils";

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: -200px;
  opacity: 0.02;
`;

const BottomContainer = styled.div`
  height: 400px;
  width: 1200px;
  position: absolute;
  top: 270px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`;

const ContainerSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  left: 75px;
  top: 300px;
  width: 675px;
  height: 320px;
  position: absolute;
`;

const ContainerStart = styled.div`
  left: 800px;
  top: 300px;
  width: 300px;
  height: 300px;
  position: absolute;
`;

const TileWrapper = styled.div<{
  width?: number;
}>`
  height: 100%;
  width: ${({ width }) => width || 450}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
`;

const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  cursor: pointer;
  color: ${Colors.white};
  text-decoration: underline;
`;

const HexInput = styled.input`
  background-color: ${Colors.darkerGreen};
  color: ${Colors.white};
  border: 1px solid ${Colors.greenLight};
  padding: 10px;
  width: 300px;
  border-radius: 4px;
  font-family: 'Source Code Pro', monospace;
  margin-top: 10px;

  &:focus {
    outline: none;
    border-color: ${Colors.greenLight};
  }

  &::placeholder {
    color: ${Colors.grayMedium};
  }
`;

interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

const SelectDirectory: React.FC = () => {
  const { setSettings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);

  const handleSelectDirectory = async () => {
    try {
      const dir = await invoke<string>("select_directory");
      setSettings((settings) => ({
        ...settings,
        selectedDir: dir,
      }));
      setSelectedDir(dir);
      console.log("Selected directory:", dir);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Failed to select directory:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <TileWrapper>
      <Tile
        heading={"Where to Store pos data?"}
        imageSrc={folder}
        imageTop={40}
        errmsg={error ?? undefined}
      />
      <Button
        onClick={handleSelectDirectory}
        label={
          selectedDir
            ? `Selected: ${shortenPath(selectedDir, 15)}`
            : "Choose directory"
        }
        width={320}
        buttonTop={100}
        backgroundColor={Colors.darkerPurple}
        borderColor={Colors.purpleLight}
      />
      <TooltipButton
        modalText={
          <>
            Select a directory where the POS data files will be stored.
            <br />
            <br />
            Make sure you have enough free space in the selected directory.
          </>
        }
        modalTop={1}
        modalLeft={1}
        buttonTop={96}
      />
    </TileWrapper>
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
      <BgImage src={size} />
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
            <SaveButton buttonLeft={55} onClick={handleSaveSpaceUnits} />
            <CancelButton buttonLeft={45} onClick={handleCancelSpaceUnits} />
          </>
        ) : (
          <>
            <SelectedValue>{settings.numUnits || MIN_SPACE_UNITS}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelSpaceUnits} />
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
          <SaveButton buttonLeft={55} onClick={handleSave} />
          <CancelButton buttonLeft={45} onClick={handleCancel} />
        </>
      ) : (
        <>
          <SelectedValue>{value}</SelectedValue>
          <CancelButton buttonLeft={50} onClick={handleCancel} />
        </>
      )}
    </TileWrapper>
  );

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <InputSection
        heading="Select number of CPU cores"
        footer={`Default: ${Math.floor((3 / 4) * maxCores)} cores (3/4 of total cores)`}
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

  // First effect to handle initial provider detection
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const detectProviders = async () => {
        await run(["-printProviders"]);
        setHasInitialized(true);
      };
      detectProviders();
    }
  }, [isOpen, hasInitialized]); // Remove run from dependencies

  // Second effect to handle provider selection
  useEffect(() => {
    if (response && response.length > 0) {
      setSelectedProvider(0);
      setSettings((prev) => ({ ...prev, provider: 0 }));
    }
  }, [response, setSettings]);

  // Reset initialization when component closes
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
    const icon = processor.DeviceType === "GPU" ? gpu : cpu;

    return (
      <TileWrapper width={350} key={processor.ID}>
        <Tile
          heading={processor.Model}
          subheader={`${processor.DeviceType}${isFastest ? " (Fastest)" : ""}`}
          footer={isSelected ? "Selected" : "Click to select"}
          imageSrc={icon}
          onClick={() => handleProviderSelect(processor.ID)}
          selected={isSelected}
        />
      </TileWrapper>
    );
  };

  if (!isOpen) return null;

  return (
    <BottomContainer>
      <BgImage src={gpu} />
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error detecting processors:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text={"No processors detected"} />
      )}
    </BottomContainer>
  );
};

const SelectIdentity: React.FC = () => {
  const { setSettings } = useSettings();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [atxId, setAtxId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: FileInputEvent) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setSettings((prev) => ({ ...prev, identityFile: file.name }));
    }
  };

  const handleAtxIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9a-fA-F]*$/.test(value) && value.length <= 64) {
      setAtxId(value);
      setSettings((prev) => ({ ...prev, atxId: value }));
      setError(null);
    } else {
      setError("ATX ID must be a valid 256-bit hexadecimal value");
    }
  };

  return (
    <BottomContainer>
      <BgImage src={key} />
      <TileWrapper>
        <Tile
          heading="Identity File (Optional)"
          subheader="Select identity.key file"
          footer={selectedFile || "No file selected"}
          errmsg={error ?? undefined}
        />
        <FileInput
          type="file"
          id="identity-file"
          accept=".key"
          onChange={handleFileChange}
        />
        <FileInputLabel htmlFor="identity-file">
          <Button
            label={selectedFile ? "Change File" : "Select File"}
            width={320}
            buttonTop={100}
            backgroundColor={Colors.darkerPurple}
            borderColor={Colors.purpleLight}
          />
        </FileInputLabel>
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="ATX ID (Optional)"
          subheader="256-bit hexadecimal value"
          footer="Enter your ATX ID"
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
  const { settings } = useSettings();
  return (
    <>
      <ContainerSummary>
        <BgImage src={rocket} />
        <Frame
          height={25}
          heading="Space Units"
          subheader={`${settings.numUnits || 4} Units (${(settings.numUnits || 4) * 64} GiB)`}
        />
        <Frame
          height={25}
          heading="Directory"
          subheader={shortenPath(settings.selectedDir ?? "", 20)}
        />
        <Frame
          height={25}
          heading="Provider"
          subheader={`ID: ${settings.provider || 0} (${settings.provider === 0 ? 'Fastest' : 'Manual Selection'})`}
        />
        <Frame
          height={25}
          heading="Proving Setup"
          subheader={`${settings.numCores} cores, ${settings.numNonces || 288} nonces`}
        />
        {settings.identityFile && (
          <Frame
            height={25}
            heading="Identity"
            subheader={`File: ${shortenPath(settings.identityFile, 20)}`}
          />
        )}
        {settings.atxId && (
          <Frame
            height={25}
            heading="ATX ID"
            subheader={`${settings.atxId.substring(0, 10)}...`}
          />
        )}
      </ContainerSummary>
      <ContainerStart>
        <Button
          label="Start Data generation"
          borderColor={Colors.purpleLight}
          backgroundColor={Colors.darkerPurple}
          buttonTop={160}
          buttonLeft={25}
          height={80}
          onClick={onStart}
        />
      </ContainerStart>
    </>
  );
};

export { SelectDirectory, SetupSize, SetupProving, SetupGPU, SelectIdentity, SetupSummary };

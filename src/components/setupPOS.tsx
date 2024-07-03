import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { CancelButton, SaveButton } from "./button";
import CustomNumberInput from "./input";
import { FindProviders } from "../services/parseResponse";
import { ErrorMessage, Subheader } from "./texts";
import size from "../assets/duplicate.png";
import cpu from "../assets/cpu.png";
import gpu from "../assets/graphics-card.png";
import { invoke } from "@tauri-apps/api/tauri";

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

const TileWrapper = styled.div<{ width?: number }>`
  height: 370px;
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

interface Settings {
  numUnits: number;
  provider: number;
  maxFileSize: number;
  datadir: string;
}

const defaultSettings: Settings = {
  numUnits: 256,
  provider: 0,
  maxFileSize: 4096,
  datadir: "/Users/username/post/data",
};

interface InputSectionProps {
  isVisible: boolean;
  label: string;
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  isVisible,
  label,
  minValue,
  maxValue,
  step,
  value,
  onChange,
  onSave,
  onCancel,
}) => (
  <>
    <TileWrapper>
      <Tile heading={label} />
      {isVisible ? (
        <>
          <CustomNumberInput
            min={minValue}
            max={maxValue}
            step={step}
            value={value}
            onChange={onChange}
          />
          <SaveButton buttonLeft={55} onClick={onSave} />
          <CancelButton buttonLeft={45} onClick={onCancel} />
        </>
      ) : (
        <>
          <SelectedValue>{value}</SelectedValue>
          <CancelButton buttonLeft={50} onClick={onCancel} />
        </>
      )}
    </TileWrapper>
  </>
);

const SetupSize: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isPOSInputVisible, setIsPOSInputVisible] = useState(true);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);

  const handleSaveSettings = useCallback(() => {
    setIsPOSInputVisible(false);
    setIsFileInputVisible(false);
    invokeBinaryWithSettings(settings);
  }, [settings]);

  const handleCancel = useCallback(() => {
    setSettings(defaultSettings);
    setIsPOSInputVisible(true);
    setIsFileInputVisible(true);
  }, []);

  const handleChange = useCallback((key: keyof Settings, value: number) => {
    setSettings((prevSettings) => ({ ...prevSettings, [key]: value }));
  }, []);

  return (
    <BottomContainer>
      <BgImage src={size} />
      <InputSection
        isVisible={isPOSInputVisible}
        label="Select POS data size"
        minValue={256}
        maxValue={999999}
        step={64}
        value={settings.numUnits}
        onChange={(val) => handleChange("numUnits", val)}
        onSave={handleSaveSettings}
        onCancel={handleCancel}
      />
      <InputSection
        isVisible={isFileInputVisible}
        label="Select file size"
        minValue={10}
        maxValue={99999}
        step={1}
        value={settings.maxFileSize}
        onChange={(val) => handleChange("maxFileSize", val)}
        onSave={handleSaveSettings}
        onCancel={handleCancel}
      />
    </BottomContainer>
  );
};

const SetupProving: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);

  const handleSaveSettings = useCallback(() => {
    setIsCpuInputVisible(false);
    setIsNoncesInputVisible(false);
    invokeBinaryWithSettings(settings);
  }, [settings]);

  const handleCancel = useCallback(() => {
    setSettings(defaultSettings);
    setIsCpuInputVisible(true);
    setIsNoncesInputVisible(true);
  }, []);

  const handleChange = useCallback((key: keyof Settings, value: number) => {
    setSettings((prevSettings) => ({ ...prevSettings, [key]: value }));
  }, []);

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <InputSection
        isVisible={isCpuInputVisible}
        label="Select number of CPU cores"
        minValue={1}
        maxValue={16}
        step={1}
        value={settings.provider}
        onChange={(val) => handleChange("provider", val)}
        onSave={handleSaveSettings}
        onCancel={handleCancel}
      />
      <InputSection
        isVisible={isNoncesInputVisible}
        label="Select number of Nonces"
        minValue={16}
        maxValue={9999}
        step={16}
        value={settings.maxFileSize}
        onChange={(val) => handleChange("maxFileSize", val)}
        onSave={handleSaveSettings}
        onCancel={handleCancel}
      />
    </BottomContainer>
  );
};

interface Props {
  isOpen: boolean;
}

const SetupGPU: React.FC<Props> = ({ isOpen }) => {
  const { run, response, loading, error } = FindProviders();

  useEffect(() => {
    if (isOpen) {
      run(["-printProviders"]);
    }
  }, [isOpen, run]);

  const createTile = useCallback(
    (processor: { ID: number; Model: string; DeviceType: string }) => {
      const isFastest = processor.ID === 0;
      const icon = processor.DeviceType === "GPU" ? gpu : cpu;

      return (
        <TileWrapper width={350} key={processor.ID}>
          <Tile
            heading={processor.Model}
            subheader={processor.DeviceType}
            footer={isFastest ? "The Fastest" : ""}
            imageSrc={icon}
          />
        </TileWrapper>
      );
    },
    []
  );

  return (
    <BottomContainer>
      <BgImage src={gpu} />
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text={"No processors detected"} />
      )}
    </BottomContainer>
  );
};

const invokeBinaryWithSettings = (settings: Settings) => {
  const { numUnits, provider, maxFileSize, datadir } = settings;
  const command = `postcli -numUnits ${numUnits} -provider ${provider} -maxFileSize ${maxFileSize} -datadir ${datadir}`;
  invoke("execute_command", { command })
    .then((response) => {
      console.log("Command executed successfully:", response);
    })
    .catch((error) => {
      console.error("Error executing command:", error);
    });
};

export { SetupSize, SetupProving, SetupGPU };

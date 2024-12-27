import { invoke } from "@tauri-apps/api";
import React, { useEffect, useState } from "react";

import { useSettings } from "../../state/SettingsContext";
import { SaveButton, CancelButton } from "../button";
import CustomNumberInput from "../input";
import Tile from "../tile";

import {
  SetupContainer,
  SetupTileWrapper,
  SelectedValue,
} from "../../styles/containers";

interface InputSectionProps {
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
}

const InputSection: React.FC<InputSectionProps> = ({
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
  <SetupTileWrapper>
    <Tile heading={heading} footer={footer} width={250} height={300} />
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
  </SetupTileWrapper>
);

export const SetupProving: React.FC = () => {
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

  return (
    <SetupContainer>
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
    </SetupContainer>
  );
};

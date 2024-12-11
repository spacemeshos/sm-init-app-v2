import React, { useEffect, useState } from "react";
import Tile from "../tile";
import { ErrorMessage, Subheader } from "../../styles/texts";
import { useSettings } from "../../state/SettingsContext";
import { useConsole } from "../../state/ConsoleContext";
import { FindProviders } from "../../utils/parseResponse";
import { BottomContainer, TileWrapper } from "./styles";

interface Props {
  isOpen: boolean;
}

interface Processor {
  ID: number;
  Model: string;
  DeviceType: string;
}

export const SetupGPU: React.FC<Props> = ({ isOpen }) => {
  const { setSettings } = useSettings();
  const { updateConsole } = useConsole();
  const { run, response, loading, error } = FindProviders();
  const [selectedProvider, setSelectedProvider] = useState<number>(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const detectProviders = async () => {
        await run(["-printProviders"], updateConsole);
        setHasInitialized(true);
      };
      detectProviders();
    }
  }, [isOpen, hasInitialized, updateConsole, run]);

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

  const createTile = (processor: Processor) => {
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

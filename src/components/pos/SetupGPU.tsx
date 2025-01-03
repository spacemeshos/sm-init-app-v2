import React, { useCallback, useEffect, useRef } from "react";

import { useConsole } from "../../state/ConsoleContext";
import { useSettings } from "../../state/SettingsContext";
import { ErrorMessage, Subheader } from "../../styles/texts";
import { FindProviders, Provider } from "../../utils/parseResponse";
import {Tile} from "../tile";

import { SetupContainer, SetupTileWrapper } from "../../styles/containers";

interface Props {
  isOpen: boolean;
  initialProviders?: Provider[] | null;
}

export const SetupGPU: React.FC<Props> = ({ isOpen, initialProviders }) => {
  const { setSettings } = useSettings();
  const { updateConsole } = useConsole();
  const { run, response, setResponse, loading, error } = FindProviders();
  const selectedProviderRef = useRef<number>(0);
  const mountedRef = useRef(false);

  // Memoize the provider selection handler
  const handleProviderSelect = useCallback(
    (providerId: number, model: string) => {
      selectedProviderRef.current = providerId;
      setSettings((prev) => ({ 
        ...prev, 
        provider: providerId,
        providerModel: model
      }));
    },
    [setSettings]
  );

  // Use initialProviders if provided
  useEffect(() => {
    if (initialProviders) {
      setResponse(initialProviders);
    }
  }, [initialProviders]);

  // Effect for initial provider detection only if no initialProviders
  useEffect(() => {
    mountedRef.current = true;

    const detectProviders = async () => {
      if (!mountedRef.current) return;
      await run(["-printProviders"], updateConsole);
    };

    if (isOpen && !initialProviders) {
      detectProviders();
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, [isOpen, run, updateConsole, initialProviders]);

  // Effect for setting initial provider when response is received
  useEffect(() => {
    if (response && response.length > 0 && mountedRef.current) {
      handleProviderSelect(0, response[0].Model);
    }
  }, [response, handleProviderSelect]);

  // Memoize tile creation to prevent unnecessary re-renders
  const createTile = useCallback(
    (processor: Provider) => {
      const isFastest = processor.ID === 0;
      const isSelected = processor.ID === selectedProviderRef.current;

      return (
        <SetupTileWrapper width={350}  key={processor.ID}>
          <Tile
            width={200}
            heading={processor.Model}
            subheader={`${processor.DeviceType}${
              isFastest ? " (Fastest)" : ""
            }`}
            footer={isSelected ? "Selected" : "Click to select"}
            onClick={() => handleProviderSelect(processor.ID, processor.Model)}
            selected={isSelected}
          />
        </SetupTileWrapper>
      );
    },
    [handleProviderSelect]
  );

  if (!isOpen) return null;

  return (
    <SetupContainer>
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error detecting processors:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text="No processors detected" />
      )}
    </SetupContainer>
  );
};

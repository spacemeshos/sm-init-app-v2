/**
 * @fileoverview Component for GPU/processor setup in POS configuration
 * Handles detection and selection of available processing units (CPU/GPU)
 * with automatic detection of fastest provider and manual override capability.
 */

import React, { useCallback, useEffect, useRef } from "react";

import { useConsole } from "../../state/ConsoleContext";
import { useSettings } from "../../state/SettingsContext";
import { SetupContainer, SetupTileWrapper } from "../../styles/containers";
import { ErrorMessage, Subheader } from "../../styles/texts";
import { FindProviders, Provider } from "../../utils/parseResponse";
import {Tile} from "../tile";

/**
 * Props for SetupGPU component
 * @interface Props
 */
interface Props {
  /** Whether the setup section is currently open */
  isOpen: boolean;
  /** Optional pre-detected providers to use instead of detection */
  initialProviders?: Provider[] | null;
}

/**
 * GPU/Processor Setup Component
 * 
 * Features:
 * - Automatic provider detection
 * - Provider selection interface
 * - Loading and error states
 * - Pre-selection of fastest provider
 * - Manual provider override
 * 
 * The component handles:
 * 1. Detection of available processing units
 * 2. Display of provider information
 * 3. Selection and configuration of providers
 * 4. Error handling and loading states
 */
export const SetupGPU: React.FC<Props> = ({ isOpen, initialProviders }) => {
  const { setSettings } = useSettings();
  const { updateConsole } = useConsole();
  const { run, response, setResponse, loading, error } = FindProviders();
  // Track selected provider across renders
  const selectedProviderRef = useRef<number>(0);
  // Track component mount state for cleanup
  const mountedRef = useRef(false);

  /**
   * Handles selection of a provider
   * Updates settings with selected provider ID and model
   */
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
  }, [initialProviders, setResponse]);

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

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
    };
  }, [isOpen, run, updateConsole, initialProviders]);

  /**
   * Auto-select first provider when providers are detected
   * First provider (ID: 0) is typically the fastest option
   */
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
        <SetupTileWrapper width={350} key={processor.ID}>
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

  // Don't render if section is not open
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

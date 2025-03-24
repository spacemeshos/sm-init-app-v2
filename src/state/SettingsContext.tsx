/**
 * @fileoverview Context provider for managing global POS settings
 * Handles configuration settings, ATX ID management, and default directory setup.
 * Provides centralized state management for POS configuration.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { fetchLatestAtxId } from "../services/postcliService";
import { SizeConstants } from "../Shared/Constants";
import { getDefaultDirectory } from "../utils/directoryUtils";

/**
 * Global settings interface for POS configuration
 * @interface Settings
 */
export interface Settings {
  pubKey?: string;
  /** Number of space units to allocate */
  numUnits?: number;
  /** Maximum file size in MiB */
  maxFileSize?: number;
  /** Number of CPU cores to use */
  numCores?: number;
  /** Number of nonces to process */
  numNonces?: number;
  /** Selected provider ID (CPU/GPU) */
  provider?: number;
  /** Provider model description */
  providerModel?: string;
  /** Custom selected directory path */
  selectedDir?: string;
  /** Default directory path */
  defaultDir?: string;
  /** Path to identity file */
  identityFile?: string;
  /** Public key for identity */
  publicKey?: string;
  /** ATX ID for commitment */
  atxId?: string;
  /** Source of ATX ID (api/manual) */
  atxIdSource: 'api' | 'manual';
  /** Error message if ATX ID fetch fails */
  atxIdError?: string;
  /** Is Atx ID is fetching right now  */
  atxIdFetching: boolean;
}

/**
 * Context interface for settings management
 * @interface SettingsContextProps
 */
interface SettingsContextProps {
  /** Current settings state */
  settings: Settings;
  /** Function to update settings */
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;

  /** Trigger fetching ATX ID */
  fetchAtxId: () => void;
}

// Create context with undefined default value
const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

/**
 * Provider component for global settings management
 * Handles:
 * - Settings initialization
 * - ATX ID fetching and management
 * - Default directory setup
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize settings with defaults
  const [settings, setSettings] = useState<Settings>({
    numUnits: SizeConstants.DEFAULT_NUM_UNITS,
    maxFileSize: SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB,
    numCores: 8,
    numNonces: 288,
    provider: 0,
    providerModel: undefined,
    selectedDir: undefined,
    defaultDir: undefined,
    identityFile: undefined,
    publicKey: undefined,
    atxId: undefined,
    atxIdSource: 'api',
    atxIdFetching: false,
    atxIdError: undefined,
  });

  /**
   * Fetches latest ATX ID from the network
   * Includes automatic retry on failure with comprehensive logging
   */
  const fetchAtxId = useCallback(async () => {
    try {
      setSettings(prev => ({
        ...prev,
        atxId: undefined,
        atxIdSource: 'api',
        atxIdFetching: true,
      }));

      const response = await fetchLatestAtxId();
      
      setSettings(prev =>
        // Update final result only if it still has API source
        // This prevents overriding manual input while fetching
        prev.atxIdFetching && prev.atxIdSource === 'api'
        ? ({
            ...prev,
            atxId: response.atxId,
            atxIdSource: 'api',
            atxIdFetching: false,
            atxIdError: undefined
          })
        : prev
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("SettingsContext: Error fetching ATX ID:", {
        error: err,
        message: errorMessage
      });
      
      // Provide more specific error messages based on error type
      let userErrorMessage = 'Failed to fetch ATX ID';
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userErrorMessage += ': Network connectivity issue';
      } else if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        userErrorMessage += ': Invalid data received';
      } else if (errorMessage.includes('missing required')) {
        userErrorMessage += ': Missing data in API response';
      } else if (errorMessage.includes('status')) {
        userErrorMessage += `: ${errorMessage}`;
      }
      
      console.error('SettingsContext: ', userErrorMessage);
      setSettings(prev => ({
        ...prev,
        atxIdFetching: false,
        atxIdError: userErrorMessage
      }));
    }
  }, []);

  /**
   * Initialize settings on component mount
   * Sets up default directory and fetches initial ATX ID
   */
  useEffect(() => {
    const initSettings = async () => {
      try {
        // Get default directory
        const defaultDir = await getDefaultDirectory();
        setSettings((prev) => ({
          ...prev,
          defaultDir: defaultDir,
        }));
      } catch (err) {
        console.error("Error getting default directory:", err);
      }
    };

    initSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, fetchAtxId }}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Hook for accessing global settings context
 * @returns {SettingsContextProps} Settings management functions and state
 * @throws {Error} If used outside of SettingsProvider
 */
export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

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
    atxIdSource: 'api'
  });

  /**
   * Fetches latest ATX ID from the network
   * Includes automatic retry on failure
   */
  const fetchAtxId = useCallback(async () => {
    try {
      const response = await fetchLatestAtxId();
      setSettings(prev => ({
        ...prev,
        atxId: response.atxId,
        atxIdSource: 'api',
        atxIdError: undefined
      }));
    } catch (err) {
      console.error("Error fetching ATX ID:", err);
      setSettings(prev => ({
        ...prev,
        atxIdError: "Failed to fetch ATX ID"
      }));
      // Retry after 5 seconds
      setTimeout(fetchAtxId, 5000);
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

      // Fetch ATX ID
      fetchAtxId();
    };

    initSettings();
  }, [fetchAtxId]);

  /**
   * Handle ATX ID source changes
   * Re-fetches ATX ID when manual input is cleared
   */
  useEffect(() => {
    if (settings.atxId === undefined && settings.atxIdSource === 'manual') {
      fetchAtxId();
    }
  }, [settings.atxId, settings.atxIdSource, fetchAtxId]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
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

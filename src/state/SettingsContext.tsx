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
   * Includes automatic retry on failure with comprehensive logging
   */
  const fetchAtxId = useCallback(async () => {
    console.log('SettingsContext: Initiating ATX ID fetch...');
    
    try {
      console.log('SettingsContext: Calling fetchLatestAtxId service...');
      const startTime = Date.now();
      const response = await fetchLatestAtxId();
      const fetchDuration = Date.now() - startTime;
      
      console.log(`SettingsContext: ATX ID fetch successful in ${fetchDuration}ms:`, response.atxId);
      
      setSettings(prev => ({
        ...prev,
        atxId: response.atxId,
        atxIdSource: 'api',
        atxIdError: undefined
      }));
      
      console.log('SettingsContext: ATX ID successfully updated in settings');
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
      
      console.log('SettingsContext: Setting error message for user:', userErrorMessage);
      
      setSettings(prev => ({
        ...prev,
        atxIdError: userErrorMessage
      }));
      
      // Retry after 5 seconds
      console.log('SettingsContext: Scheduling retry in 5 seconds...');
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

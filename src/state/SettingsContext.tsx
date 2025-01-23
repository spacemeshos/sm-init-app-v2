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

export interface Settings {
  pubKey?: string;
  numUnits?: number;
  maxFileSize?: number;
  numCores?: number;
  numNonces?: number;
  provider?: number;
  providerModel?: string;
  selectedDir?: string;
  defaultDir?: string;
  identityFile?: string;
  publicKey?: string;
  atxId?: string;
  atxIdSource: 'api' | 'manual';
  atxIdError?: string;
}

interface SettingsContextProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  // Re-fetch ATX ID if manual input is cleared
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

export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

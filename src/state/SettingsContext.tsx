import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDefaultDirectory } from "../utils/directoryUtils";

export interface Settings {
  pubKey?: string;
  numUnits?: number;
  maxFileSize?: number;
  numCores?: number;
  numNonces?: number;
  provider?: number;
  selectedDir?: string;
  defaultDir?: string;
  identityFile?: string;
  publicKey?: string;
  atxId?: string;
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
    numUnits: 4,
    maxFileSize: 4096,
    numCores: 8,
    numNonces: 288,
    provider: 0,
    selectedDir: undefined,
    defaultDir: undefined,
    identityFile: undefined,
    publicKey: undefined,
    atxId: "65f77244a23870ee39f15cf088ee1651745c3b73195491e277bc65aa56937425", //TESTING PURPOSES to be replaced with API call eventually
  });

  useEffect(() => {
    const initDefaultPath = async () => {
      try {
        const defaultDir = await getDefaultDirectory();
        setSettings((prev) => ({
          ...prev,
          defaultDir: defaultDir,
        }));
      } catch (err) {
        console.error("Error getting default directory:", err);
      }
    };

    initDefaultPath();
  }, []);

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

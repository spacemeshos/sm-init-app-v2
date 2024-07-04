import React, { createContext, useContext, useState, ReactNode } from "react";

interface Settings {
  datadir?: string;
  pubKey?: string;
  numUnits?: number;
  maxFileSize?: number;
  numCores?: number;
  numNonces?: number;
  provider?: number;
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
    datadir: "/Users/username/post/data", //TODO
    numUnits: 4,
    maxFileSize: 4096,
    numCores: 8,
    numNonces: 288,
    provider: 0,
  });

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

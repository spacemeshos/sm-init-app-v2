import React, { createContext, useContext, useState, ReactNode } from "react";
import { stopPostCliProcess } from "../services/postcliService";
import { useConsole } from "./ConsoleContext";

interface POSProcessState {
  isRunning: boolean;
  processId: number | null;
}

interface POSProcessContextProps {
  processState: POSProcessState;
  startProcess: (pid: number) => void;
  stopProcess: () => Promise<void>;
}

const POSProcessContext = createContext<POSProcessContextProps | undefined>(undefined);

export const POSProcessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [processState, setProcessState] = useState<POSProcessState>({
    isRunning: false,
    processId: null,
  });
  const { updateConsole } = useConsole();

  const startProcess = (pid: number) => {
    setProcessState({
      isRunning: true,
      processId: pid,
    });
  };

  const stopProcess = async () => {
    if (processState.processId) {
      try {
        await stopPostCliProcess(processState.processId, updateConsole);
        setProcessState({
          isRunning: false,
          processId: null,
        });
      } catch (error) {
        console.error("Failed to stop POS process:", error);
        // Even if the stop command fails, we should reset the state
        // as the process might have already terminated
        setProcessState({
          isRunning: false,
          processId: null,
        });
        throw error;
      }
    }
  };

  return (
    <POSProcessContext.Provider value={{ processState, startProcess, stopProcess }}>
      {children}
    </POSProcessContext.Provider>
  );
};

export const usePOSProcess = (): POSProcessContextProps => {
  const context = useContext(POSProcessContext);
  if (!context) {
    throw new Error("usePOSProcess must be used within a POSProcessProvider");
  }
  return context;
};

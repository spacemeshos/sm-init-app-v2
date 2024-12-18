import React, { createContext, ReactNode, useContext, useState } from "react";
import { Stage, FileProgress, POSSettings } from "../types/posProgress";
import { parsePOSProgress } from "../utils/posProgressParser";
import { stopPostCliProcess } from "../services/postcliService";
import { useConsole } from "./ConsoleContext";
import { useSettings } from "./SettingsContext";

interface POSProcessState {
  stage: Stage;
  progress: number;
  details: string;
  isError: boolean;
  logs: string[];
  fileProgress?: FileProgress;
  isRunning: boolean;
  processId: number | null;
}

interface POSProcessContextProps {
  processState: POSProcessState;
  startProcess: (pid: number) => void;
  stopProcess: () => Promise<void>;
  processLog: (log: string) => void;
  reset: () => void;
}

const initialState: POSProcessState = {
  stage: Stage.NotStarted,
  progress: 0,
  details: "Waiting to start...",
  isError: false,
  logs: [],
  isRunning: false,
  processId: null,
};

const POSProcessContext = createContext<POSProcessContextProps | undefined>(
  undefined
);

export const POSProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [processState, setProcessState] = useState<POSProcessState>(initialState);
  const { updateConsole } = useConsole();
  const { settings } = useSettings();

  const startProcess = (pid: number) => {
    setProcessState(prev => ({
      ...prev,
      isRunning: true,
      processId: pid,
      stage: Stage.Processing,
      progress: 0,
      details: "Starting POS data generation...",
      isError: false,
      logs: [],
    }));
  };

  const stopProcess = async () => {
    if (processState.processId) {
      try {
        await stopPostCliProcess(processState.processId, updateConsole);
        setProcessState(prev => ({
          ...prev,
          isRunning: false,
          processId: null,
          stage: Stage.NotStarted,
          progress: 0,
          details: "Process stopped",
        }));
      } catch (error) {
        console.error("Failed to stop POS process:", error);
        setProcessState(prev => ({
          ...prev,
          isRunning: false,
          processId: null,
          stage: Stage.Error,
          details:
            error instanceof Error ? error.message : "Failed to stop process",
          isError: true,
        }));
        throw error;
      }
    }
  };

  const processLog = (log: string) => {
    const posSettings: POSSettings = {
      numUnits: settings.numUnits || 4,
      maxFileSize: settings.maxFileSize || 4096
    };

    const parsed = parsePOSProgress(log, posSettings);
    
    setProcessState(prev => {
      // If we're already in a terminal state (Complete or Error), don't process more logs
      if (prev.stage === Stage.Complete || (prev.stage === Stage.Error && prev.isError)) {
        return prev;
      }

      return {
        ...prev,
        stage: parsed.stage,
        progress: parsed.progress,
        details: parsed.details,
        isError: parsed.isError,
        fileProgress: parsed.fileProgress,
        logs: [...prev.logs, log],
        // Update running state based on terminal conditions
        isRunning: parsed.stage !== Stage.Complete && parsed.stage !== Stage.Error
      };
    });
  };

  const reset = () => {
    setProcessState(initialState);
  };

  return (
    <POSProcessContext.Provider
      value={{
        processState,
        startProcess,
        stopProcess,
        processLog,
        reset,
      }}
    >
      {children}
    </POSProcessContext.Provider>
  );
};

export const usePOSProcess = (): POSProcessContextProps => {
  const context = useContext(POSProcessContext);
  if (context === undefined) {
    throw new Error("usePOSProcess must be used within a POSProcessProvider");
  }
  return context;
};

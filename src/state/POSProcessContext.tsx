/**
 * @fileoverview Context provider for managing Proof of Space (POS) process state
 * Handles process lifecycle, log processing, and progress tracking for POS data generation.
 * Provides a centralized way to manage and monitor long-running POS processes.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

import { stopPostCliProcess } from "../services/postcliService";
import { SizeConstants } from "../Shared/Constants";
import { Stage, FileProgress, POSSettings } from "../types/posProgress";
import { parsePOSProgress } from "../utils/posProgressParser";

import { useConsole } from "./ConsoleContext";
import { useSettings } from "./SettingsContext";
import useFileProgress from '../hooks/useFileProgress';

/**
 * State interface for POS process
 * @interface POSProcessState
 */
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

/**
 * Context interface for POS process management
 * @interface POSProcessContextProps
 */
interface POSProcessContextProps {
  processState: POSProcessState;
  startProcess: (pid: number) => void;
  stopProcess: () => Promise<void>;
  processLog: (log: string) => void;
  reset: () => void;
}

/**
 * Initial state for POS process
 * Sets up default values for all state properties
 */
const initialState: POSProcessState = {
  stage: Stage.NotStarted,
  progress: 0,
  details: "Waiting to start...",
  isError: false,
  logs: [],
  isRunning: false,
  processId: null,
};

// Create context with undefined default value
const POSProcessContext = createContext<POSProcessContextProps | undefined>(
  undefined
);

/**
 * Provider component for POS process management
 * Manages process state and provides methods for process control
 * 
 * Features:
 * - Process lifecycle management
 * - Log processing and progress tracking
 * - Error handling
 * - Event-based progress updates
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const POSProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [processState, setProcessState] = useState<POSProcessState>(initialState);
  const { updateConsole } = useConsole();
  const { settings } = useSettings();
  const { setFileIndex, filePath, fileProgress } = useFileProgress(
    settings.selectedDir || settings.defaultDir || '',
    (settings.maxFileSize ?? 32) * 1024 * 1024,
    10000
  );

  /**
   * Initializes a new POS process
   * Resets state and sets up for new process execution
   * @param {number} pid - Process ID of the new process
   */
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

  /**
   * Stops the currently running process
   * Attempts graceful shutdown and updates state accordingly
   * @throws {Error} If process termination fails
   */
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

  /**
   * Processes a new log entry from the POS process
   * Updates state based on parsed log content
   * 
   * Process:
   * 1. Cleans log entry
   * 2. Parses progress information
   * 3. Updates state while preserving relevant previous state
   * 4. Handles terminal states (Complete/Error)
   * 
   * @param {string} log - Raw log entry to process
   */
  const processLog = React.useCallback((log: string) => {
    console.log('Processing log:', log);
    
    // Strip postcli stdout/stderr prefixes from the log
    const cleanLog = log.replace(/^postcli (stdout|stderr):\s*/, '');
    
    // Prepare settings for progress parsing
    const posSettings: POSSettings = {
      numUnits: settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS,
      maxFileSize: settings.maxFileSize || SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
    };

    console.log('Settings for parsing:', posSettings);
    const parsed = parsePOSProgress(cleanLog, posSettings);
    console.log('Parsed progress:', parsed);
    
    setProcessState(prev => {
      // If we're already in a terminal state (Complete or Error), don't process more logs
      if (prev.stage === Stage.Complete || (prev.stage === Stage.Error && prev.isError)) {
        return prev;
      }

      // Keep previous fileProgress if the new parsed state doesn't have it
      const updatedFileProgress = parsed.fileProgress || prev.fileProgress;

      let fileProgressPart = 0;
      if (updatedFileProgress?.currentFile && !updatedFileProgress?.isCompleted) {
        setFileIndex(updatedFileProgress.currentFile);
        fileProgressPart = fileProgress / updatedFileProgress.totalFiles;
        console.log('Watching for...', fileProgress, '% of', filePath, '=', parsed.progress + fileProgressPart, `${fileProgressPart}%`);
      }
      
      const newState = {
        ...prev,
        stage: parsed.stage,
        progress: parsed.progress + fileProgressPart,
        details: parsed.details,
        isError: parsed.isError,
        fileProgress: updatedFileProgress,
        logs: [...prev.logs, cleanLog],
        // Update running state based on terminal conditions
        isRunning: parsed.stage !== Stage.Complete && parsed.stage !== Stage.Error
      };
      console.log('New process state:', newState);
      return newState;
    });
  }, [settings]);

  /**
   * Resets process state to initial values
   * Used when starting fresh or cleaning up
   */
  const reset = () => {
    setProcessState(initialState);
  };

  // Set up event listener for progress updates
  React.useEffect(() => {
    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        processLog(customEvent.detail);
      }
    };

    window.addEventListener('postcli-progress', handleProgress);
    return () => window.removeEventListener('postcli-progress', handleProgress);
  }, [processLog]); // processLog contains settings dependency internally

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

/**
 * Hook for accessing POS process context
 * @returns {POSProcessContextProps} Process management functions and state
 * @throws {Error} If used outside of POSProcessProvider
 */
export const usePOSProcess = (): POSProcessContextProps => {
  const context = useContext(POSProcessContext);
  if (context === undefined) {
    throw new Error("usePOSProcess must be used within a POSProcessProvider");
  }
  return context;
};

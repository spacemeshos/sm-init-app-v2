import { Stage, ParsedPOSProgress, POSSettings } from "../types/posProgress";
import { calculateNumFiles } from "./sizeUtils";

export const parsePOSProgress = (log: string, settings: POSSettings): ParsedPOSProgress => {
  // Default response
  const defaultResponse: ParsedPOSProgress = {
    stage: Stage.Processing,
    progress: 0,
    details: "Starting POS data generation...",
    isError: false
  };

  if (!log) return defaultResponse;

  // Calculate total files based on settings
  const totalFiles = calculateNumFiles(settings.numUnits, settings.maxFileSize);

  // Check for errors first
  if (log.toLowerCase().includes("error")) {
    return {
      stage: Stage.Error,
      progress: 0,
      details: log,
      isError: true
    };
  }

  // Parse file completion
  const fileCompleteMatch = log.match(/initialization: completed.*"fileIndex": (\d+)/);
  if (fileCompleteMatch) {
    const currentFile = parseInt(fileCompleteMatch[1]);
    const progress = ((currentFile + 1) / totalFiles) * 100;

    return {
      stage: Stage.Processing,
      progress,
      details: `${currentFile + 1} of ${totalFiles} files generated (${Math.round(progress)}%)`,
      isError: false,
      fileProgress: {
        currentFile,
        totalFiles,
        currentLabels: 0,
        targetLabels: 0
      }
    };
  }

  // Check for final completion
  if (log.includes("initialization: completed, found nonce")) {
    return {
      stage: Stage.Complete,
      progress: 100,
      details: `All ${totalFiles} files have been generated successfully`,
      isError: false
    };
  }

  // Return default response for other log lines
  return defaultResponse;
};

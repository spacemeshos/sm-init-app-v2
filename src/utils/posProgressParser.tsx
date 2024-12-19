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
  const fileCompleteMatch = log.match(
    /(.*?\s+)(INFO\s+initialization:\s+completed\s+\{"fileIndex":\s)(\d+)(,.*?})/
  );
  if (fileCompleteMatch) {
    const currentFile = parseInt(fileCompleteMatch[3]);
    const progress = ((currentFile + 1) / totalFiles) * 100;

    return {
      stage: Stage.Processing,
      progress,
      details: `${currentFile + 1} of ${totalFiles} files generated (${Math.round(progress)}%)`,
      isError: false,
      fileProgress: {
        currentFile,
        totalFiles,
      }
    };
  }

  // Check for final completion
  if (log.includes("cli: initialization completed")) {
    return {
      stage: Stage.Complete,
      progress: 100,
      details: `All ${totalFiles} files have been generated successfully`,
      isError: false,
    };
  }

  // Return default response for other log lines
  return defaultResponse;
};

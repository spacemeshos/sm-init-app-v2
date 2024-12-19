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
  const fileCompleteMatch = log.match(/\s+INFO\s+initialization: completed.*"fileIndex": (\d+).*"numLabelsWritten": (\d+)/);
  if (fileCompleteMatch) {
    const currentFile = parseInt(fileCompleteMatch[1]);
    const labelsWritten = parseInt(fileCompleteMatch[2]);
    const progress = ((currentFile + 1) / totalFiles) * 100;

    return {
      stage: Stage.Processing,
      progress,
      details: `${currentFile + 1} of ${totalFiles} files generated (${Math.round(progress)}%)`,
      isError: false,
      fileProgress: {
        currentFile,
        totalFiles,
        currentLabels: labelsWritten,
        targetLabels: labelsWritten // At completion, current equals target
      }
    };
  }

  // Parse file start
  const fileStartMatch = log.match(/\s+INFO\s+initialization: starting to write file.*"fileIndex": (\d+).*"currentNumLabels": (\d+).*"targetNumLabels": (\d+)/);
  if (fileStartMatch) {
    const currentFile = parseInt(fileStartMatch[1]);
    const currentLabels = parseInt(fileStartMatch[2]);
    const targetLabels = parseInt(fileStartMatch[3]);
    const progress = (currentFile / totalFiles) * 100;

    return {
      stage: Stage.Processing,
      progress,
      details: `Generating file ${currentFile + 1} of ${totalFiles}...`,
      isError: false,
      fileProgress: {
        currentFile,
        totalFiles,
        currentLabels,
        targetLabels
      }
    };
  }

  // Check for final completion
  if (log.includes("INFO") && log.includes("initialization: completed, found nonce")) {
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

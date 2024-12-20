import { Stage, ParsedPOSProgress, POSSettings } from "../types/posProgress";
import { calculateNumFiles } from "./sizeUtils";

export const parsePOSProgress = (log: string, settings: POSSettings): ParsedPOSProgress => {
  console.log('Parsing log:', log);
  // Default response
  const defaultResponse: ParsedPOSProgress = {
    stage: Stage.Processing,
    progress: 0,
    details: "Generating Proof of Space data...",
    isError: false
  };

  if (!log) return defaultResponse;

  // Remove the "postcli stdout: " prefix if present
  const cleanLog = log.replace(/^postcli stdout:\s*/, '');

  // Calculate total files based on settings
  const totalFiles = calculateNumFiles(settings.numUnits, settings.maxFileSize);

  // Check for errors first
  if (cleanLog.toLowerCase().includes("error")) {
    return {
      stage: Stage.Error,
      progress: 0,
      details: cleanLog,
      isError: true
    };
  }

  // Parse file completion
  const fileCompleteMatch = cleanLog.match(/INFO\s+initialization:\s+completed\s+{"fileIndex":\s*(\d+)/);
  if (fileCompleteMatch) {
    const currentFile = parseInt(fileCompleteMatch[1]);
    const progress = ((currentFile + 1) / totalFiles) * 100;
    
    console.log('Matched file completion:', { currentFile, totalFiles, progress });
    
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
  if (cleanLog.includes("cli: initialization completed")) {
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

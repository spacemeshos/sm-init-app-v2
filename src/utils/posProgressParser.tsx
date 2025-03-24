/**
 * @fileoverview Parser for Proof of Space (POS) initialization progress logs
 * Processes raw log output from the postcli tool and converts it into structured progress data
 * 
 * As per what Bartek and NJ suggested, we need to modify the code to check the directory periodically: 
 * Parsing logs has a downside that it will break when the log is changed / removed
 * How about examining the created files instead? 
 * I.e. every N seconds walk the directory and calculate how many bytes are already initialized (total sum of all postdata_n.bin files
 * if implemented in some smart way (ie checking always last file in the directory) and detecting the expected size then it can be prety minimalistic
 */

import { Stage, ParsedPOSProgress, POSSettings } from "../types/posProgress";

import { calculateNumFiles } from "./sizeUtils";

/**
 * Parses postcli log output to track POS initialization progress
 * 
 * The parser handles several types of log entries:
 * - File completion notifications
 * - Error messages
 * - Final completion status
 * 
 * @param {string} log - Raw log output from postcli
 * @param {POSSettings} settings - Current POS configuration settings
 * @returns {ParsedPOSProgress} Structured progress information including:
 *   - Current stage (Processing/Complete/Error)
 *   - Progress percentage
 *   - Human-readable status message
 *   - Error state
 *   - File progress details (if available)
 */
export const parsePOSProgress = (log: string, settings: POSSettings): ParsedPOSProgress => {
  console.log('Parsing log:', log);
  // Initialize with default "processing" state
  const defaultResponse: ParsedPOSProgress = {
    stage: Stage.Processing,
    progress: 0,
    details: "Generating Proof of Space data...",
    isError: false
  };

  // Return default state if no log provided
  if (!log) return defaultResponse;

  // Clean up log by removing tool prefix
  const cleanLog = log.replace(/^postcli stdout:\s*/, '');

  // Calculate expected total number of files based on current settings
  const totalFiles = calculateNumFiles(settings.numUnits, settings.maxFileSize);

  // First priority: Check for error messages and critical warnings
  if (
    cleanLog.toLowerCase().includes("error") ||
    cleanLog.toLowerCase().includes("aborting") ||
    (cleanLog.includes("WARNING") && 
     (cleanLog.includes("commitmentAtxId") || 
      cleanLog.includes("cannot proceed")))
  ) {
    console.log('Error detected in log:', cleanLog);
    
    // Format a user-friendly error message
    let errorDetails = cleanLog;
    
    // Special handling for common error cases
    if (cleanLog.includes("commitmentAtxId")) {
      errorDetails = "Directory was previously initialized with a different ATX ID. " +
                    "Please choose a different directory or use the existing ATX ID.";
    } else if (cleanLog.toLowerCase().includes("aborting")) {
      // Extract the reason for aborting if possible
      const abortLines = cleanLog.split('\n').filter(line => 
        line.includes("WARNING") || line.toLowerCase().includes("aborting")
      );
      
      if (abortLines.length > 0) {
        errorDetails = "Process aborted: " + abortLines.join(' ');
      } else {
        errorDetails = "Process aborted unexpectedly. Check the console for details.";
      }
    }
    
    console.log('Formatted error details:', errorDetails);
    
    return {
      stage: Stage.Error,
      progress: 0,
      details: errorDetails,
      isError: true
    };
  }

  // Second priority: Parse file completion progress
  // Format: "INFO initialization: completed {"fileIndex": X}"
  const fileCompleteMatch = cleanLog.match(/INFO\s+initialization:\s+(?:completed|file already initialized)\s+{"fileIndex":\s*(\d+)/);
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

  // Third priority: Check for final completion message
  if (cleanLog.includes("cli: initialization completed") || cleanLog.includes("initialization: completed, found nonce")) {
    return {
      stage: Stage.Complete,
      progress: 100,
      details: `All ${totalFiles} files have been generated successfully`,
      isError: false,
    };
  }

  // Fallback: Return default "processing" state for unrecognized log lines
  return defaultResponse;
};

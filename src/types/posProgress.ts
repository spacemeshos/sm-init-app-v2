/* eslint-disable no-unused-vars */
export enum Stage {
  NotStarted = 'NOT_STARTED',
  Processing = 'PROCESSING',
  Complete = 'COMPLETE',
  Error = 'ERROR',
}
/* eslint-enable no-unused-vars */

export interface FileProgress {
  isCompleted: boolean;
  currentFile: number;
  totalFiles: number;
}

export interface POSSettings {
  numUnits: number;
  maxFileSize: number;
}

export interface ParsedPOSProgress {
  stage: Stage;
  progress: number;
  details: string;
  isError: boolean;
  fileProgress?: FileProgress;
}

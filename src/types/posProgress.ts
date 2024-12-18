export enum Stage {
  NotStarted = 'NOT_STARTED',
  Processing = 'PROCESSING',
  Complete = 'COMPLETE',
  Error = 'ERROR',
}

export interface FileProgress {
  currentFile: number;
  totalFiles: number;
  currentLabels: number;
  targetLabels: number;
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

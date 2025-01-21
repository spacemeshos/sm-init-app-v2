export interface GPUMetrics {
  hashRate: number; // hashes/second
  memoryThroughput: number; // GB/s
  gpuUtilization: number; // percentage
  dataSpeed: number; // GiB/s
  estimatedTimeRemaining?: number; // seconds
  gpuModel?: string; // GPU model name
  error?: string; // Error message if profiling fails
}

export enum GPUProfilerStatus {
  Idle = 'Idle',
  Running = 'Running',
  Complete = 'Complete',
  Error = 'Error',
}

export interface GPUProfilerConfig {
  targetDataSize: number; // GiB
  duration: number; // seconds
  outputPath?: string; // Path to save generated data
}

export interface GPUProfilerState {
  status: GPUProfilerStatus;
  metrics?: GPUMetrics;
  config: GPUProfilerConfig;
}

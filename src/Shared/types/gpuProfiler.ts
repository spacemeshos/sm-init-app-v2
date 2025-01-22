export interface GPUMetrics {
  hash_rate: number; // hashes/second
  memory_throughput: number; // GB/s
  gpu_utilization: number; // percentage
  data_speed: number; // GiB/s
  estimated_time?: number; // seconds
  gpu_model?: string; // GPU model name
  error?: string; // Error message if profiling fails
}

export enum GPUProfilerStatus {
  Idle = 'Idle',
  Running = 'Running',
  Complete = 'Complete',
  Error = 'Error',
}

export interface GPUProfilerConfig {
  target_data_size: number; // GiB
  duration: number; // seconds
  output_path?: string; // Path to save generated data
}

export interface GPUProfilerState {
  status: GPUProfilerStatus;
  metrics?: GPUMetrics;
  config: GPUProfilerConfig;
}

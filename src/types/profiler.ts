export enum BenchmarkStatus {
  Idle = 'Idle',
  Running = 'Running',
  Complete = 'Complete',
  Error = 'Error',
}

export interface ProfilerConfig {
  data_size: number;
  duration: number;
  data_file?: string;
}

export interface ProfilerResult {
  speed_gib_s?: number;
  error?: string;
}

export interface Benchmark extends ProfilerResult {
  nonces: number;
  threads: number;
  status: BenchmarkStatus;
  data_file?: string;
}

export interface BenchmarkSettings {
  nonces: number;
  threads: number;
}

export interface AccuracyConfig {
  data_size: number;
  duration: number;
}

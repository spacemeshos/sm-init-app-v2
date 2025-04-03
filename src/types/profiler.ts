/**
 * @fileoverview Type definitions for the Proof of Space (POS) profiler functionality.
 * These types define the structure of profiler configurations, benchmarks, and results.
 */

/* eslint-disable no-unused-vars */
/**
 * Represents the current state of a benchmark operation
 * @enum {string}
 */
export enum BenchmarkStatus {
  Idle = 'Idle',         // Benchmark is configured but not started
  Running = 'Running',   // Benchmark is currently executing
  Complete = 'Complete', // Benchmark has finished successfully
  Error = 'Error',      // Benchmark encountered an error during execution
}
/* eslint-enable no-unused-vars */

/**
 * Configuration options for the profiler
 * @interface ProfilerConfig
 */
export interface ProfilerConfig {
  data_size: number;    // Size of data to process in gibibytes
  duration: number;     // Duration of the benchmark in seconds
  data_file?: string;  // Optional path to the data file used for profiling
}

/**
 * Results from a profiler run
 * @interface ProfilerResult
 */
export interface ProfilerResult {
  speed_gib_s?: number;  // Processing speed in GiB/s (optional, present on successful runs)
  error?: string;        // Error message if the profiler run failed
}

/**
 * Represents a complete benchmark including configuration and results
 * @interface Benchmark
 * @extends ProfilerResult
 */
export interface Benchmark extends ProfilerResult {
  id: number;             // Unique identifier of benchmark (to not overwrite previous runs)
  nonces: number;         // Number of nonces to process in the benchmark
  threads: number;        // Number of CPU threads to use
  status: BenchmarkStatus; // Current status of the benchmark
  data_file?: string;     // Path to the data file used in this benchmark
}

/**
 * Settings for configuring a new benchmark
 * @interface BenchmarkSettings
 */
export interface BenchmarkSettings {
  nonces: number;   // Number of nonces to process (affects memory usage)
  threads: number;  // Number of CPU threads to utilize (1 to maxCores)
}

/**
 * Configuration for accuracy testing
 * @interface AccuracyConfig
 */
export interface AccuracyConfig {
  data_size: number;  // Size of data to use in accuracy testing (in GB)
  duration: number;   // Duration of the accuracy test in seconds
}

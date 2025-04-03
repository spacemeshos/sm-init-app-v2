/**
 * @fileoverview Custom React hook for managing the Proof of Space (POS) profiler functionality.
 * This hook handles benchmarking operations, configuration management, and integration with
 * the Tauri backend for CPU profiling operations.
 */

import { invoke } from '@tauri-apps/api';
import { join } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

import { useConsole } from '../state/ConsoleContext';
import { useSettings } from '../state/SettingsContext';
import {
  Benchmark,
  BenchmarkSettings,
  BenchmarkStatus,
  ProfilerConfig,
  ProfilerResult,
} from '../types/profiler';

/**
 * Default configuration for the profiler
 * @property {number} data_size - Size of data to process in the benchmark (in GB)
 * @property {number} duration - Duration of the benchmark in seconds
 */
const DEFAULT_CONFIG: ProfilerConfig = {
  data_size: 1,
  duration: 10,
};

/**
 * Custom hook for managing POS profiler operations and state
 * @returns {Object} Object containing profiler state and control functions
 */
export const useProfiler = () => {
  // Access global settings context for directory configurations
  const { settings, setSettings } = useSettings();
  const { updateConsole } = useConsole();
  
  // State management for profiler configuration and results
  const [maxCores, setMaxCores] = useState(0);                                    // Maximum available CPU cores
  const [config, setConfig] = useState<ProfilerConfig>(DEFAULT_CONFIG);           // Current profiler configuration
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);                  // List of completed and ongoing benchmarks
  const [benchmarkSettings, setBenchmarkSettings] = useState<BenchmarkSettings>(   // Current benchmark parameters
    {
      nonces: 288,  // Default number of nonces to process
      threads: 1,   // Default number of threads to use, can be freely adjusted
    }
  );

  /**
   * Initialize the profiler on component mount
   * - Fetches available CPU cores from the system
   * - Retrieves default configuration from the backend
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get available CPU cores from the system
        const cores = await invoke<number>('get_cpu_cores');
        setMaxCores(cores);
        // Fetch default configuration from Tauri backend
        const defaultConfig =
          await invoke<ProfilerConfig>('get_default_config');
        setConfig(defaultConfig);
      } catch (error) {
        console.error('Error initializing POSProfiler:', error);
      }
    };

    initialize();
  }, []);

  /**
   * Executes a single benchmark with specified parameters
   * @param {Benchmark} benchmark - Benchmark configuration to run
   * @throws {Error} If no directory is selected for profiling
   */
  const runBenchmark = async (benchmark: Benchmark) => {
    try {
      setBenchmarks((prev) =>
        prev.map((b) =>
          b.id === benchmark.id
            ? { ...b, status: BenchmarkStatus.Running }
            : b
        )
      );

      if (!settings.selectedDir && !settings.defaultDir) {
        throw new Error('No directory selected for profiling');
      }

      const currentDir =
        settings.selectedDir || (settings.defaultDir as string);
      const dataFilePath = await join(currentDir, 'profiler-data');

      updateConsole('profiler', `Running profiler: ${benchmark.nonces} nonces, ${benchmark.threads} threads at ${dataFilePath}. Data size: ${config.data_size} GiB, duration: ${config.duration} seconds`);

      const result = await invoke<ProfilerResult>('run_profiler', {
        nonces: benchmark.nonces,
        threads: benchmark.threads,
        config: {
          ...config,
          data_file: dataFilePath,
        },
      });

      updateConsole('profiler', `Profiler result: ${JSON.stringify(result)}`);

      setBenchmarks((prev) =>
        prev.map((b) =>
          b.nonces === benchmark.nonces && b.threads === benchmark.threads
            ? {
                ...b,
                ...result,
                status: BenchmarkStatus.Complete,
                data_file: currentDir,
              }
            : b
        )
      );
    } catch (error) {
      setBenchmarks((prev) =>
        prev.map((b) =>
          b.nonces === benchmark.nonces && b.threads === benchmark.threads
            ? { ...b, status: BenchmarkStatus.Error, error: String(error) }
            : b
        )
      );
    }
  };

  /**
   * Creates and executes a new benchmark with current settings
   * @throws {Error} If no directory is selected for profiling
   */
  const runCustomBenchmark = async () => {
    if (!settings.selectedDir && !settings.defaultDir) {
      throw new Error('No directory selected for profiling');
    }

    const currentDir = settings.selectedDir || (settings.defaultDir as string);
    const newBenchmark: Benchmark = {
      nonces: benchmarkSettings.nonces,
      threads: benchmarkSettings.threads,
      status: BenchmarkStatus.Idle,
      data_file: currentDir,
    };

    setBenchmarks((prev) => [...prev, newBenchmark]);
    await runBenchmark(newBenchmark);
  };

  /**
   * Updates global settings with the results of a completed benchmark
   * @param {Benchmark} benchmark - The completed benchmark to apply
   */
  const selectBenchmark = (benchmark: Benchmark) => {
    if (benchmark.status === BenchmarkStatus.Complete) {
      setSettings((prev) => ({
        ...prev,
        numNonces: benchmark.nonces,
        numCores: benchmark.threads,
      }));
    }
  };

  /**
   * Updates the current benchmark settings
   * @param {Partial<BenchmarkSettings>} settings - Partial settings to update
   */
  const updateBenchmarkSettings = (settings: Partial<BenchmarkSettings>) => {
    setBenchmarkSettings((prev) => ({ ...prev, ...settings }));
  };

  /**
   * Updates the profiler configuration
   * @param {Partial<ProfilerConfig>} updates - Partial configuration to update
   */
  const updateConfig = (updates: Partial<ProfilerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return {
    maxCores,                    // Maximum available CPU cores
    config,                      // Current profiler configuration
    benchmarks,                  // List of all benchmarks
    benchmarkSettings,           // Current benchmark settings
    updateConfig,               // Function to update profiler configuration
    updateBenchmarkSettings,    // Function to update benchmark settings
    runCustomBenchmark,        // Function to run a new benchmark
    selectBenchmark,           // Function to apply a benchmark's results
    isRunning: benchmarks.some((b) => b.status === BenchmarkStatus.Running), // Whether any benchmark is currently running
  };
};

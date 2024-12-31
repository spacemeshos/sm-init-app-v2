import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { join } from '@tauri-apps/api/path';
import { useSettings } from '../state/SettingsContext';
import {
  Benchmark,
  BenchmarkSettings,
  BenchmarkStatus,
  ProfilerConfig,
  ProfilerResult,
} from '../types/profiler';

const DEFAULT_CONFIG: ProfilerConfig = {
  data_size: 1,
  duration: 10,
};

export const useProfiler = () => {
  const { settings, setSettings } = useSettings();
  const [maxCores, setMaxCores] = useState(0);
  const [config, setConfig] = useState<ProfilerConfig>(DEFAULT_CONFIG);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [benchmarkSettings, setBenchmarkSettings] = useState<BenchmarkSettings>(
    {
      nonces: 288,
      threads: 1,
    }
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const cores = await invoke<number>('get_cpu_cores');
        setMaxCores(cores);
        const defaultConfig =
          await invoke<ProfilerConfig>('get_default_config');
        setConfig(defaultConfig);
      } catch (error) {
        console.error('Error initializing POSProfiler:', error);
      }
    };

    initialize();
  }, []);

  const runBenchmark = async (benchmark: Benchmark) => {
    try {
      setBenchmarks((prev) =>
        prev.map((b) =>
          b.nonces === benchmark.nonces && b.threads === benchmark.threads
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

      const result = await invoke<ProfilerResult>('run_profiler', {
        nonces: benchmark.nonces,
        threads: benchmark.threads,
        config: {
          ...config,
          data_file: dataFilePath,
        },
      });

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

  const selectBenchmark = (benchmark: Benchmark) => {
    if (benchmark.status === BenchmarkStatus.Complete) {
      setSettings((prev) => ({
        ...prev,
        numNonces: benchmark.nonces,
        numCores: benchmark.threads,
      }));
    }
  };

  const updateBenchmarkSettings = (settings: Partial<BenchmarkSettings>) => {
    setBenchmarkSettings((prev) => ({ ...prev, ...settings }));
  };

  const updateConfig = (updates: Partial<ProfilerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return {
    maxCores,
    config,
    benchmarks,
    benchmarkSettings,
    updateConfig,
    updateBenchmarkSettings,
    runCustomBenchmark,
    selectBenchmark,
    isRunning: benchmarks.some((b) => b.status === BenchmarkStatus.Running),
  };
};

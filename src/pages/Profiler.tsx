/**
 * POSProfiler Component
 *
 * A comprehensive profiling tool for Proof of Space-Time (PoST) performance analysis.
 * This component allows users to:
 * - Run benchmarks with different configurations of nonces and CPU threads
 * - View and compare performance metrics
 * - Test custom settings
 * - Select optimal configurations for their system
 */

import { invoke } from '@tauri-apps/api';
import { join } from '@tauri-apps/api/path';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSettings } from '../state/SettingsContext';
import { Button } from '../components/button';
import CustomNumberInput from '../components/input';
import { SelectDirectory } from '../components/pos/SelectDirectory';
import { Background, PageTitleWrapper } from '../styles/containers';
import { BodyText, Header } from '../styles/texts';
import Tile from '../components/tile';
import Colors from '../styles/colors';
import BackgroundImage from '../assets/wave2.png';
import { useNavigate } from 'react-router-dom';
import ProfilerTable, {
  Benchmark,
  BenchmarkStatus,
  ProfilerResult,
} from '../components/ProfilerTable';

const ProfilerContainer = styled.div`
  width: 1100px;
  height: 600px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 160px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  gap: 10px;
`;

const ButtonsContainer = styled.div`
  width: 810px;
  height: 70px;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 20px;
`;

/**
 * Interface Definitions
 */

// Configuration settings for the profiler
interface ProfilerConfig {
  data_size: number; // Size of data to process in GiB
  duration: number; // Duration of the benchmark in seconds
  data_file?: string; // Optional custom path for data file
}

/**
 * Main POSProfiler Component
 *
 * Manages the state and logic for:
 * - Running benchmarks with different configurations
 * - Displaying results in a tabular format
 * - Handling custom benchmark configurations
 * - Updating global settings based on selected results
 */

const Profiler: React.FC = () => {
  const navigate = useNavigate();
  const { settings, setSettings } = useSettings();
  const [maxCores, setMaxCores] = useState(0);
  const [config, setConfig] = useState<ProfilerConfig>({
    data_size: 1,
    duration: 10,
  });
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [customNonces, setCustomNonces] = useState(288);
  const [customThreads, setCustomThreads] = useState(1);
  const [showAccuracyParams, setShowAccuracyParams] = useState(false);
  const [showInfo, setshowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize component with system information
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

  /**
   * Executes a single benchmark with specified configuration
   * Updates the benchmark status and results in real-time
   * Calculates probability of successful proof generation
   */
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
        throw new Error("No directory available");
      }
      const currentDir = settings.selectedDir || settings.defaultDir as string;
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

  /**
   * Executes a benchmark with user-specified nonce and thread counts
   * Adds the new benchmark to the list and scrolls to show results
   */
  const runCustomBenchmark = async () => {
    if (!settings.selectedDir && !settings.defaultDir) {
      throw new Error("No directory available");
    }
    const currentDir = settings.selectedDir || settings.defaultDir as string;
    const dataFilePath = await join(currentDir, 'profiler-data');
    const newBenchmark: Benchmark = {
      nonces: customNonces,
      threads: customThreads,
      status: BenchmarkStatus.Idle,
      data_file: currentDir, // Keep directory path for display purposes
    };

    setBenchmarks((prev) => [...prev, newBenchmark]);
    await runBenchmark(newBenchmark);
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  /**
   * Updates global settings with the selected benchmark configuration
   * Only allows selection of completed benchmarks
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

  return (
    <>
      <Background src={BackgroundImage} />
      <PageTitleWrapper>
        <Header text="PoS Profiler" />
      </PageTitleWrapper>
      <ProfilerContainer>
        {/* How it works */}
        <Tile
          height={showInfo ? 200 : 50}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => setshowInfo(!showInfo)}
        >
          {!showInfo ? (
            <Tile heading="how it works?" />
          ) : (
            <Tile>
              <BodyText
                text="The profiler helps estimate how fast Proof of Space-Time (PoST) can be generated. 
                It measures performance based on CPU threads, nonce count, and data size. 
                Higher nonce counts increase proof probability but require more CPU power."
              />
            </Tile>
          )}
        </Tile>

        {/* Benchmarch accuracy params*/}

        <Tile
          height={showAccuracyParams ? 200 : 50}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={showAccuracyParams ? 'How accurate the test should be' : ''}
          footer={
            showAccuracyParams
              ? 'Increase amount of data or duration time for more accurate results'
              : ''
          }
          onClick={() => setShowAccuracyParams(!showAccuracyParams)}
        >
          {!showAccuracyParams ? (
            <Tile heading="adjust test accuracy" />
          ) : (
            <>
              <Tile heading="GiB to process:" height={150} top={50}>
                <CustomNumberInput
                  min={1}
                  max={64}
                  step={1}
                  value={config.data_size}
                  onChange={(val) =>
                    setConfig((prev) => ({ ...prev, data_size: val }))
                  }
                />
              </Tile>
              <Tile heading="Duration (s):" height={150} top={50}>
                <CustomNumberInput
                  min={5}
                  max={60}
                  step={5}
                  value={config.duration}
                  onChange={(val) =>
                    setConfig((prev) => ({ ...prev, duration: val }))
                  }
                />
              </Tile>
            </>
          )}
        </Tile>

        {/* Select Directory */}
        <Tile
          height={200}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          <SelectDirectory />
        </Tile>

        {/* Custom Proving Settings */}
        <Tile
          height={200}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="Test drive and CPU to find optimal config and know your POS Data max size"
        >
          <Tile heading="Nonces:" height={200}>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={customNonces}
              onChange={(val) => setCustomNonces(val)}
            />
          </Tile>
          <Tile heading="CPU Threads:" height={200}>
            <CustomNumberInput
              min={1}
              max={maxCores}
              step={1}
              value={customThreads}
              onChange={(val) => setCustomThreads(val)}
            />
          </Tile>
        </Tile>

        {/* Results*/}
        {/* <Tile
          height={100}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading="results: speed and max data size"
        /> */}

        {/* Table with test results history*/}

        <Tile
          height={200}
          width={1020}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading="table of results"
        >
          <ProfilerTable
            benchmarks={benchmarks}
            onBenchmarkSelect={selectBenchmark}
            scrollRef={scrollRef}
            config={config}
            customNonces={customNonces}
            customThreads={customThreads}
          />
        </Tile>

        <ButtonsContainer>
          <Button
            onClick={runCustomBenchmark}
            disabled={benchmarks.some(
              (b) => b.status === BenchmarkStatus.Running
            )}
            label="Test My Settings"
            width={250}
            height={52}
          />
          <Button
            label="View full config"
            onClick={() => navigate('/config')} //TO DO
            width={250}
            height={52}
          />
          <Button
            label="What next?"
            onClick={() => navigate('/nextSteps')} //TO DO
            width={250}
            height={52}
          />
        </ButtonsContainer>
      </ProfilerContainer>
    </>
  );
};

export default Profiler;

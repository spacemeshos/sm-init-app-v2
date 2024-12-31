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
import { join, homeDir } from '@tauri-apps/api/path';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { calculateMaxDataSize, formatSize } from '../utils/sizeUtils';
import { useSettings } from '../state/SettingsContext';
import Modal from '../components/modal';
import Image from '../components/image';
import Tile from '../components/tile';
import ProfilerTable, {
  Benchmark,
  BenchmarkStatus,
  ProfilerResult,
} from '../components/ProfilerTable';
import { BackButton, Button } from '../components/button';
import CustomNumberInput from '../components/input';
import { SelectDirectory } from '../components/pos/SelectDirectory';
import { Background, PageTitleWrapper } from '../styles/containers';
import { BodyText, Header, Title } from '../styles/texts';
import Colors from '../styles/colors';
import InfoIcon from '../assets/help.png';
import Gear from '../assets/setting.png';
import Control from '../assets/control.png';
import NextStep from '../assets/nextstep.png';
import BackgroundImage from '../assets/wave3.jpg';

const ProfilerContainer = styled.div`
  width: 1100px;
  height: 600px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 155px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  gap: 5px;
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
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
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
        throw new Error('No directory available');
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

  /**
   * Executes a benchmark with user-specified nonce and thread counts
   * Adds the new benchmark to the list and scrolls to show results
   */
  const runCustomBenchmark = async () => {
    if (!settings.selectedDir && !settings.defaultDir) {
      throw new Error('No directory available');
    }
    const currentDir = settings.selectedDir || (settings.defaultDir as string);
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
      {/* How it works modal */}

      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        header="How it works"
        text="The profiler helps estimate how fast Proof of Space-Time (PoST) can be generated. 
          It measures performance based on CPU threads, nonce count, and data size. 
          Higher nonce counts increase proof probability but require more CPU power."
        //TO DO more comprehensive explanation
        width={600}
        height={400}
      />

      {/* Benchmark accuracy modal */}

      <Modal
        isOpen={showAccuracyModal}
        onClose={() => setShowAccuracyModal(false)}
        header="How accurate the test should be" //TO DO rephrase and fix layout
        text="Increase amount of data or duration time for more accurate results"
        width={700}
        height={500}
      >
        <>
          <Tile heading="GiB to process:" height={150}>
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
          <Tile heading="Duration (s):" height={150}>
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
      </Modal>

      {/* Main POSProfiler content */}

      <Background src={BackgroundImage} />
      <BackButton onClick={() => navigate('/')} />
      <PageTitleWrapper>
        <Header text="PoS Profiler" />
      </PageTitleWrapper>
      <ProfilerContainer>
        {/* How it works */}
        <Tile
          footer="How it works?"
          height={100}
          width={120}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => setShowInfoModal(true)}
        >
          <Image src={InfoIcon} width={35} top={20} />
        </Tile>

        {/* Benchmark accuracy params */}
        <Tile
          footer="Test Accuracy"
          height={100}
          width={120}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => setShowAccuracyModal(true)}
        >
          <Image src={Gear} width={35} top={20} />
        </Tile>

        {/* Config preview */}
        <Tile
          footer="Full config"
          height={100}
          width={120}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => navigate('/config')} //TO DO
        >
          <Image src={Control} width={35} top={20} />
        </Tile>

        {/* What next button */}
        <Tile
          footer="What Next?"
          height={100}
          width={120}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => navigate('/nextSteps')} //TO DO
        >
          <Image src={NextStep} width={35} top={20} />
        </Tile>

        {/* Info */}
        <Tile
          height={100}
          width={550}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onClick={() => setShowInfoModal(true)}
        >
          <BodyText
            top={30}
            text="The profiler helps estimate how much POS Data you can prove on time. 
            Succesful proving within cycle gap is crucial for rewards eligibility."
          />
        </Tile>

        {/* Select Directory */}
        <Tile
          height={230}
          width={495}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          <SelectDirectory />
        </Tile>

        {/* Custom Proving Settings */}
        <Tile
          height={230}
          width={550}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="Experiment with these params to find optimal config. 
          Try to balance the probability of one pass and max proving speed."
        >
          <Tile heading="Nonces:" height={130} top={25}>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={customNonces}
              onChange={(val) => setCustomNonces(val)}
            />
          </Tile>
          <Tile heading="CPU Cores:" height={130} top={25}>
            <CustomNumberInput
              min={1}
              max={maxCores}
              step={1}
              value={customThreads}
              onChange={(val) => setCustomThreads(val)}
            />
          </Tile>
        </Tile>

        {/* Result Max POS Data to Prove + Speed */}
        <Tile
          heading="Proving Speed"
          footer="GiB/s"
          height={120}
          width={350}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          {benchmarks.length > 0 &&
            (() => {
              const speed = benchmarks[benchmarks.length - 1].speed_gib_s;
              return <Header top={45} text={`${speed?.toFixed(2) ?? '...'}`} />;
            })()}
        </Tile>

        <Tile
          heading="Max POS Size"
          height={120}
          width={350}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          {benchmarks.length > 0 &&
            (() => {
              const speed = benchmarks[benchmarks.length - 1].speed_gib_s;
             return <Header top={45} text={`${speed !== undefined ? formatSize(calculateMaxDataSize(speed)) : '...'}`} />;
            })()}
        </Tile>
        {/* Run Benchmark Button */}

        <Tile height={120} width={340}>
          <Button
            onClick={runCustomBenchmark}
            disabled={benchmarks.some(
              (b) => b.status === BenchmarkStatus.Running
            )}
            label="Test My Settings"
            width={250}
            height={52}
            margin={25}
          />
        </Tile>

        {/* Table with test results history*/}

        <Tile
          height={300}
          width={1050}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading="Results History"
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
      </ProfilerContainer>
    </>
  );
};

export default Profiler;

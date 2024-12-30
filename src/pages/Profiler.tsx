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

import { invoke } from "@tauri-apps/api";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSettings } from "../state/SettingsContext";
import { Button } from "../components/button";
import CustomNumberInput from "../components/input";
import { SelectDirectory } from "../components/pos/SelectDirectory";
import { Background, PageTitleWrapper } from "../styles/containers";
import { BodyText, Header } from "../styles/texts";
import Tile from "../components/tile";
import Colors from "../styles/colors";
import BackgroundImage from "../assets/wave2.png";
import { useNavigate } from "react-router-dom";

// Styled Components for layout and presentation
/**
 * Styled component definitions for the UI layout
 * Container - Main wrapper for the profiler interface
 * Provides consistent padding and flex column layout
 */

const ProfilerContainer = styled.div`
  width: 1100px;
  height: 600px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 170px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 10px;
`;

const DetailsContainer = styled.div`
  width: 400px;
  height: 310px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: auto;
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
  gap: 10px;
`;

const Table = styled.div`
  display: flex;
  width: 900px;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  flex-direction: column;
  border: 1px solid ${Colors.whiteOpaque};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  font-family: "Univers55", sans-serif;
  color: ${Colors.greenVeryLight};
`;

const TableBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
  width: 100%;
  max-height: 350px;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  font-family: "Univers55", sans-serif;
  color: ${Colors.greenVeryLight};
  overflow-y: auto;
`;

const TableRow = styled.div<{ isClickable?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  height: 35px;
  border-bottom: 0.5px solid ${Colors.white};
  cursor: ${({ isClickable }) => (isClickable ? "pointer" : "default")};

  &:hover {
    background: ${({ isClickable }) =>
      isClickable ? Colors.greenLightOpaque : "none"};
  }
`;

const Column = styled.div`
  width: 12.5%;
`;

const StatusIndicator = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 5px;
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

// Results from a profiling run
interface ProfilerResult {
  nonces: number; // Number of nonces processed
  threads: number; // Number of CPU threads used
  time_s: number; // Time taken in seconds
  speed_gib_s: number; // Processing speed in GiB/second
  data_size: number; // Size of data processed
  duration: number; // Actual duration of the benchmark
  data_file?: string; // Path to data file used
}

enum BenchmarkStatus {
  Idle = "Idle",
  Running = "Running",
  Complete = "Complete",
  Error = "Error",
}

interface Benchmark extends Partial<ProfilerResult> {
  nonces: number;
  threads: number;
  status: BenchmarkStatus;
  error?: string; // Error message if status is Error
}

/**
 * Helper function to determine the color coding for different benchmark statuses
 * Green for complete, Orange for running, Red for error, Grey for idle
 */
const getStatusColor = (status: BenchmarkStatus) => {
  switch (status) {
    case BenchmarkStatus.Complete:
      return Colors.greenLight;
    case BenchmarkStatus.Running:
      return Colors.blueLight;
    case BenchmarkStatus.Error:
      return Colors.red;
    default:
      return Colors.grayMedium;
  }
};

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize component with system information
  useEffect(() => {
    const initialize = async () => {
      try {
        const cores = await invoke<number>("get_cpu_cores");
        setMaxCores(cores);
        const defaultConfig = await invoke<ProfilerConfig>(
          "get_default_config"
        );
        setConfig(defaultConfig);
      } catch (error) {
        console.error("Error initializing POSProfiler:", error);
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

      const result = await invoke<ProfilerResult>("run_profiler", {
        nonces: benchmark.nonces,
        threads: benchmark.threads,
        config: {
          ...config,
          data_file: settings.selectedDir || undefined,
        },
      });

      setBenchmarks((prev) =>
        prev.map((b) =>
          b.nonces === benchmark.nonces && b.threads === benchmark.threads
            ? { ...b, ...result, status: BenchmarkStatus.Complete }
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
    const newBenchmark: Benchmark = {
      nonces: customNonces,
      threads: customThreads,
      status: BenchmarkStatus.Idle,
    };

    setBenchmarks((prev) => [...prev, newBenchmark]);
    await runBenchmark(newBenchmark);
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
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
      <PageTitleWrapper
        style={{ height: 150, flexDirection: "column", textTransform: "none" }}
      >
        <Header text="PoS Profiler" />
        <BodyText
          text="The profiler helps estimate how fast Proof of Space-Time (PoST) can be
          generated. It measures performance based on CPU threads, nonce count,
          and data size. Higher nonce counts increase proof probability but
          require more CPU power. Aim for at least 95% probability for reliable
          proof generation."
        />
      </PageTitleWrapper>
      <ProfilerContainer>
        <Tile
          height={250}
          width={400}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          <SelectDirectory />
        </Tile>
        <Tile
          height={250}
          width={600}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="Test drive and CPU to find optimal config and know your POS Data max size"
        >
          <Tile heading="Nonces:" height={250}>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={customNonces}
              onChange={(val) => setCustomNonces(val)}
            />
          </Tile>
          <Tile heading="CPU Threads:" height={250}>
            <CustomNumberInput
              min={1}
              max={maxCores}
              step={1}
              value={customThreads}
              onChange={(val) => setCustomThreads(val)}
            />
          </Tile>
        </Tile>

        {/* Configuration controls for benchmark parameters */}

        <Tile
          height={300}
          width={500}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading="How accurate the test should be"
          footer="Increase amount of data or duration time for more accurate results"
        >
          <Tile heading="GiB to process:" height={200}>
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
          <Tile heading="Duration (s):" height={200}>
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
        </Tile>

        <DetailsContainer>
          <Tile
            height={150}
            width={500}
            blurred
            backgroundColor={Colors.whiteOpaque}
            heading="results: speed"
          />
          <Tile
            height={150}
            width={500}
            blurred
            backgroundColor={Colors.whiteOpaque}
            heading="results: max data size"
          />
        </DetailsContainer>
        <Tile
          height={80}
          width={800}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading="table of results"
        >
          <Table>
            <TableHeader>
              <Column>Nonces</Column>
              <Column>Threads</Column>
              <Column>Time (s)</Column>
              <Column>Speed (GiB/s)</Column>
              <Column>Size</Column>
              <Column>Duration</Column>
              <Column>Directory</Column>
              <Column>Status</Column>
            </TableHeader>
            <TableBody ref={scrollRef}>
              {benchmarks.map((benchmark, index) => (
                <TableRow
                  key={`${benchmark.nonces}-${benchmark.threads}-${index}`}
                  isClickable={benchmark.status === BenchmarkStatus.Complete}
                  onClick={() => selectBenchmark(benchmark)}
                >
                  <Column>{benchmark.nonces ?? customNonces}</Column>
                  <Column>{benchmark.threads ?? customThreads}</Column>
                  <Column>{benchmark.time_s?.toFixed(2) ?? "..."}</Column>
                  <Column>{benchmark.speed_gib_s?.toFixed(2) ?? "..."}</Column>
                  <Column>{benchmark.data_size ?? config.data_size}</Column>
                  <Column>{benchmark.duration ?? config.duration}</Column>
                  <Column>{benchmark.data_file || "Temp"}</Column>
                  <Column>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <StatusIndicator
                        color={getStatusColor(benchmark.status)}
                      />
                      {benchmark.error || benchmark.status}
                    </div>
                  </Column>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            onClick={() => navigate("/config")} //TO DO
            width={250}
            height={52}
          />
          <Button
            label="What next?"
            onClick={() => navigate("/nextSteps")} //TO DO
            width={250}
            height={52}
          />
        </ButtonsContainer>
      </ProfilerContainer>
    </>
  );
};

export default Profiler;

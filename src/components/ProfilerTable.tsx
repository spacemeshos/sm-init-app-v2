/**
 * @fileoverview ProfilerTable component for displaying benchmark results in a tabular format.
 * This component provides a detailed view of profiling results with expandable details,
 * status indicators, and interactive selection capabilities.
 */

import React, { useState } from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';
import { BenchmarkStatus } from '../types/profiler';
import { getDirectoryDisplay } from '../utils/directoryUtils';
import { calculateMaxDataSize, formatSize } from '../utils/sizeUtils';

// Styled Components for table layout and visualization

/**
 * Root container for the profiler table
 * Centers the table and handles overflow
 */
const Table = styled.div`
  display: flex;
  width: 100%;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * Header row containing column titles
 * Uses consistent styling with white border for separation
 */
const TableHeader = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  background: transparent;
  padding: 10px;
  font-size: 14px;
  font-family: 'Univers55', sans-serif;
  border-bottom: 0.5px solid ${Colors.white};
  color: ${Colors.white};
`;

/**
 * Scrollable container for benchmark results
 * Limited to 200px height with overflow scrolling
 */
const TableBody = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
  width: 100%;
  max-height: 200px;
  background: transparent;
  padding: 10px;
  font-size: 14px;
  font-family: 'Univers55', sans-serif;
  color: ${Colors.greenVeryLight};
  overflow-y: auto;
`;

/**
 * Individual row in the table
 * Becomes interactive when the benchmark is complete
 */
const TableRow = styled.div<{ isClickable?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  min-height: 35px;
  border-bottom: 0.5px solid ${Colors.greenVeryLight};
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ isClickable }) =>
      isClickable ? Colors.greenLightOpaque : 'none'};
  }
`;

/**
 * Table column with dynamic width based on detail view state
 * Expands or contracts based on whether detailed view is active
 */
const Column = styled.div<{ expanded?: boolean }>`
  width: ${({ expanded }) => (expanded ? '11%' : '17%')};
`;

/**
 * Button to toggle between basic and detailed views
 * Positioned absolutely in the top-right corner
 * to be placed better in the future, it's a quick and ugly implementation
 */ 
const ToggleButton = styled.button`
  position: absolute;
  right: 0px;
  top: 0px;
  background: ${Colors.greenLightOpaque};
  color: ${Colors.white};
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Univers55', sans-serif;
  font-size: 10px;

  &:hover {
    background: ${Colors.darkOpaque};
  }

  user-select: none;
  -webkit-user-select: none;
`;

/**
 * Circular indicator showing benchmark status
 * Color-coded based on the current state of the benchmark
 * placing in the table to fix, it's a bit off now
 */
const StatusIndicator = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 20px;
`;

/**
 * Extended interface for profiler results
 * Includes all measurable metrics from a benchmark run
 */
export interface ProfilerResult {
  nonces: number;
  threads: number;
  time_s: number;
  speed_gib_s: number;
  data_size: number;
  duration: number;
  data_file: string; // Made required instead of optional
}

/**
 * Interface for benchmark entries in the table
 * Extends ProfilerResult but makes some fields optional for in-progress benchmarks
 */
export interface Benchmark extends Partial<ProfilerResult> {
  id: number;
  nonces: number;
  threads: number;
  status: BenchmarkStatus;
  error?: string;
  data_file?: string; // Added explicitly to ensure it's tracked in benchmarks
}

/**
 * Maps benchmark status to corresponding color codes
 * @param {BenchmarkStatus} status - Current status of the benchmark
 * @returns {string} Color code from the Colors constant
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
 * Props interface for the ProfilerTable component
 * @interface ProfilerTableProps
 */
interface ProfilerTableProps {
  /** List of benchmarks to display */
  benchmarks: Benchmark[];
  /** Callback function when a completed benchmark is selected */
  onBenchmarkSelect: (benchmark: Benchmark) => void;
  /** Optional ref for scrolling behavior */
  scrollRef?: React.RefObject<HTMLDivElement>;
  /** Current profiler configuration */
  config: {
    data_size: number;
    duration: number;
  };
  /** Current custom nonces setting */
  customNonces: number;
  /** Current custom threads setting */
  customThreads: number;
}

/**
 * Component for displaying benchmark results in a tabular format
 * Features:
 * - Expandable view with additional details
 * - Color-coded status indicators
 * - Interactive rows for completed benchmarks - to be select to fill the pos setup params (not yet implemented)
 * - Automatic formatting of sizes and speeds
 */
const ProfilerTable: React.FC<ProfilerTableProps> = ({
  benchmarks,
  onBenchmarkSelect,
  scrollRef,
  config,
  customNonces,
  customThreads,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Table>
      <ToggleButton onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? '<<' : 'More Details'}
      </ToggleButton>
      <TableHeader>
        <Column expanded={showDetails}>Nonces</Column>
        <Column expanded={showDetails}>Threads</Column>
        <Column expanded={showDetails}>Speed (GiB/s)</Column>
        <Column expanded={showDetails}>Max Size</Column>
        <Column expanded={showDetails}>Status</Column>
        {showDetails && (
          <>
            <Column expanded={showDetails}>Time (s)</Column>
            <Column expanded={showDetails}>Size</Column>
            <Column expanded={showDetails}>Duration</Column>
            <Column expanded={showDetails}>Directory</Column>
          </>
        )}
      </TableHeader>
      <TableBody ref={scrollRef}>
        {benchmarks.map((benchmark) => (
          <TableRow
            key={`${benchmark.nonces}-${benchmark.threads}-${benchmark.id}`}
            isClickable={benchmark.status === BenchmarkStatus.Complete}
            onClick={() => onBenchmarkSelect(benchmark)}
          >
            <Column expanded={showDetails}>
              {benchmark.nonces ?? customNonces}
            </Column>
            <Column expanded={showDetails}>
              {benchmark.threads ?? customThreads}
            </Column>
            <Column expanded={showDetails}>
              {benchmark.speed_gib_s?.toFixed(2) ?? '...'}
            </Column>
            <Column expanded={showDetails}>
              {benchmark.speed_gib_s
                ? formatSize(calculateMaxDataSize(benchmark.speed_gib_s))
                : '...'}
            </Column>
            <Column expanded={showDetails}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StatusIndicator color={getStatusColor(benchmark.status)} />
                {benchmark.error || benchmark.status}
              </div>
            </Column>
            {showDetails && (
              <>
                <Column expanded={showDetails}>
                  {benchmark.time_s?.toFixed(2) ?? '...'}
                </Column>
                <Column expanded={showDetails}>
                  {benchmark.data_size ?? config.data_size}
                </Column>
                <Column expanded={showDetails}>
                  {benchmark.duration ?? config.duration}
                </Column>
                <Column expanded={showDetails}>
                  {getDirectoryDisplay(benchmark.data_file, 'Default', 20)}
                </Column>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProfilerTable;

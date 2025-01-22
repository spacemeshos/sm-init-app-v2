import React, { useState } from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';
import { getDirectoryDisplay } from '../utils/directoryUtils';
import { calculateMaxDataSize, formatSize } from '../utils/sizeUtils';

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

const Column = styled.div<{ expanded?: boolean }>`
  width: ${({ expanded }) => (expanded ? '11%' : '17%')};
`;

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
`;

const StatusIndicator = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 20px;
`;

// Types and Interfaces
export enum BenchmarkStatus {
  Idle = 'Idle',
  Running = 'Running',
  Complete = 'Complete',
  Error = 'Error',
}

export interface ProfilerResult {
  nonces: number;
  threads: number;
  time_s: number;
  speed_gib_s: number;
  data_size: number;
  duration: number;
  data_file: string; // Made required instead of optional
}

export interface Benchmark extends Partial<ProfilerResult> {
  nonces: number;
  threads: number;
  status: BenchmarkStatus;
  error?: string;
  data_file?: string; // Added explicitly to ensure it's tracked in benchmarks
}

// Helper Functions
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

interface ProfilerTableProps {
  benchmarks: Benchmark[];
  onBenchmarkSelect: (benchmark: Benchmark) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  config: {
    data_size: number;
    duration: number;
  };
  customNonces: number;
  customThreads: number;
}

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
        {benchmarks.map((benchmark, index) => (
          <TableRow
            key={`${benchmark.nonces}-${benchmark.threads}-${index}`}
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

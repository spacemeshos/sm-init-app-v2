import React from 'react';
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
  font-size: 16px;
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
  max-height: 120px;
  background: transparent;
  padding: 10px;
  font-size: 16px;
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
  height: 35px;
  border-bottom: 0.5px solid ${Colors.greenVeryLight};
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ isClickable }) =>
      isClickable ? Colors.greenLightOpaque : 'none'};
  }
`;

const Column = styled.div`
  width: 11%;
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
  return (
    <Table>
      <TableHeader>
        <Column>Nonces</Column>
        <Column>Threads</Column>
        <Column>Time (s)</Column>
        <Column>Speed (GiB/s)</Column>
        <Column>Size</Column>
        <Column>Duration</Column>
        <Column>Max Size</Column>
        <Column>Directory</Column>
        <Column>Status</Column>
      </TableHeader>
      <TableBody ref={scrollRef}>
        {benchmarks.map((benchmark, index) => (
          <TableRow
            key={`${benchmark.nonces}-${benchmark.threads}-${index}`}
            isClickable={benchmark.status === BenchmarkStatus.Complete}
            onClick={() => onBenchmarkSelect(benchmark)}
          >
            <Column>{benchmark.nonces ?? customNonces}</Column>
            <Column>{benchmark.threads ?? customThreads}</Column>
            <Column>{benchmark.time_s?.toFixed(2) ?? '...'}</Column>
            <Column>{benchmark.speed_gib_s?.toFixed(2) ?? '...'}</Column>
            <Column>{benchmark.data_size ?? config.data_size}</Column>
            <Column>{benchmark.duration ?? config.duration}</Column>
            <Column>
              {benchmark.speed_gib_s 
                ? formatSize(calculateMaxDataSize(benchmark.speed_gib_s))
                : "..."}
            </Column>
            <Column>
              {getDirectoryDisplay(benchmark.data_file, 'Default', 20)}
            </Column>
            <Column>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StatusIndicator color={getStatusColor(benchmark.status)} />
                {benchmark.error || benchmark.status}
              </div>
            </Column>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProfilerTable;

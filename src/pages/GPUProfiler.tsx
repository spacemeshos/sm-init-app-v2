import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import styled from 'styled-components';
import { Background, PageTitleWrapper } from '../styles/containers';
import { Header, BodyText } from '../styles/texts';
import { BackButton } from '../components/button';
import { Tile } from '../components/tile';
import Colors from '../styles/colors';
import { useNavigate } from 'react-router-dom';
import { GPUMetrics, GPUProfilerStatus } from '../Shared/types/gpuProfiler';
import BackgroundImage from '../assets/banner4.png';

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
  gap: 20px;
`;

const MetricTile: React.FC<{
  title: string;
  value: string | number;
  unit: string;
}> = ({ title, value, unit }) => (
  <Tile
    heading={title}
    footer={unit}
    height={150}
    width={250}
    blurred
    backgroundColor={Colors.whiteOpaque}
  >
    <Header top={60} text={value.toString()} />
  </Tile>
);

const GPUProfiler: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<GPUProfilerStatus>(
    GPUProfilerStatus.Idle
  );
  const [metrics, setMetrics] = useState<GPUMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runProfiler = async () => {
    try {
      setStatus(GPUProfilerStatus.Running);
      setError(null);

      const config = {
        target_data_size: 100, // 100 GiB
        duration: 30, // 30 seconds
      };

      const result = await invoke<GPUMetrics>('run_gpu_profiler', { config });
      setMetrics(result);
      setStatus(GPUProfilerStatus.Complete);
    } catch (err) {
      setError(err as string);
      setStatus(GPUProfilerStatus.Error);
    }
  };

  React.useEffect(() => {
    runProfiler();
  }, []);

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton onClick={() => navigate('/')} />
      <PageTitleWrapper>
        <Header text="GPU Profiler" />
      </PageTitleWrapper>

      <ProfilerContainer>
        {status === GPUProfilerStatus.Running && (
          <Tile
            heading="Status"
            height={150}
            width={1050}
            blurred
            backgroundColor={Colors.whiteOpaque}
          >
            <BodyText top={60} text="Profiling GPU performance..." />
          </Tile>
        )}

        {status === GPUProfilerStatus.Error && (
          <Tile
            heading="Error"
            height={150}
            width={1050}
            blurred
            backgroundColor={Colors.whiteOpaque}
          >
            <BodyText top={60} text={error || 'An unknown error occurred'} />
          </Tile>
        )}

        {status === GPUProfilerStatus.Complete && metrics && (
          <>
            <Tile
              heading="GPU Model"
              height={150}
              width={1050}
              blurred
              backgroundColor={Colors.whiteOpaque}
            >
              <Header top={60} text={metrics.gpuModel || 'Unknown GPU'} />
            </Tile>

            <MetricTile
              title="Hash Rate"
              value={(metrics.hashRate / 1_000_000).toFixed(2)}
              unit="MH/s"
            />

            <MetricTile
              title="Memory Throughput"
              value={metrics.memoryThroughput.toFixed(2)}
              unit="GB/s"
            />

            <MetricTile
              title="GPU Utilization"
              value={metrics.gpuUtilization.toFixed(1)}
              unit="%"
            />

            <MetricTile
              title="Data Generation Speed"
              value={metrics.dataSpeed.toFixed(2)}
              unit="GiB/s"
            />

            {metrics.estimatedTimeRemaining && (
              <MetricTile
                title="Estimated Time"
                value={(metrics.estimatedTimeRemaining / 3600).toFixed(1)}
                unit="hours"
              />
            )}
          </>
        )}
      </ProfilerContainer>
    </>
  );
};

export default GPUProfiler;

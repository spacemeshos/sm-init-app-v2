import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { calculateMaxDataSize, formatSize } from '../utils/sizeUtils';
import Modal from '../components/modal';
import Tile, { ActionTile } from '../components/tile';
import ProfilerTable from '../components/ProfilerTable';
import { BackButton, Button } from '../components/button';
import CustomNumberInput from '../components/input';
import { SelectDirectory } from '../components/pos/SelectDirectory';
import { Background, PageTitleWrapper } from '../styles/containers';
import { BodyText, Header } from '../styles/texts';
import Colors from '../styles/colors';
import { useProfiler } from '../hooks/useProfiler';

// Assets
import InfoIcon from '../assets/help.png';
import Gear from '../assets/setting.png';
import Control from '../assets/control.png';
import NextStep from '../assets/nextstep.png';
import BackgroundImage from '../assets/wave3.jpg';

export const PROFILER_CONSTANTS = {
  MIN_NONCES: 16,
  MAX_NONCES: 9999,
  MIN_DURATION: 5,
  MAX_DURATION: 60,
  MIN_DATA_SIZE: 1,
  MAX_DATA_SIZE: 64,
  DEFAULT_NONCES: 288,
  DEFAULT_THREADS: 1,
} as const;

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

const Profiler: React.FC = () => {
  const navigate = useNavigate();
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    maxCores,
    config,
    benchmarks,
    benchmarkSettings,
    updateConfig,
    updateBenchmarkSettings,
    runCustomBenchmark,
    selectBenchmark,
    isRunning,
  } = useProfiler();

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
              min={PROFILER_CONSTANTS.MIN_DATA_SIZE}
              max={PROFILER_CONSTANTS.MAX_DATA_SIZE}
              step={1}
              value={config.data_size}
              onChange={(val) => updateConfig({ data_size: val })}
            />
          </Tile>
          <Tile heading="Duration (s):" height={150}>
            <CustomNumberInput
              min={PROFILER_CONSTANTS.MIN_DURATION}
              max={PROFILER_CONSTANTS.MAX_DURATION}
              step={5}
              value={config.duration}
              onChange={(val) => updateConfig({ duration: val })}
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
        <ActionTile
          footer="How it works?"
          icon={InfoIcon}
          onClick={() => setShowInfoModal(true)}
        />
        <ActionTile
          footer="Test Accuracy"
          icon={Gear}
          onClick={() => setShowAccuracyModal(true)}
        />
        <ActionTile
          footer="Full config"
          icon={Control}
          onClick={() => navigate('/config')}
        />
        <ActionTile
          footer="What Next?"
          icon={NextStep}
          onClick={() => navigate('/nextSteps')}
        />

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
              min={PROFILER_CONSTANTS.MIN_NONCES}
              max={PROFILER_CONSTANTS.MAX_NONCES}
              step={16}
              value={benchmarkSettings.nonces}
              onChange={(val) => updateBenchmarkSettings({ nonces: val })}
            />
          </Tile>
          <Tile heading="CPU Cores:" height={130} top={25}>
            <CustomNumberInput
              min={1}
              max={maxCores}
              step={1}
              value={benchmarkSettings.threads}
              onChange={(val) => updateBenchmarkSettings({ threads: val })}
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
              return (
                <Header
                  top={45}
                  text={`${
                    speed !== undefined
                      ? formatSize(calculateMaxDataSize(speed))
                      : '...'
                  }`}
                />
              );
            })()}
        </Tile>

        {/* Run Benchmark Button */}
        <Tile height={120} width={340}>
          <Button
            onClick={runCustomBenchmark}
            disabled={isRunning}
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
            customNonces={benchmarkSettings.nonces}
            customThreads={benchmarkSettings.threads}
          />
        </Tile>
      </ProfilerContainer>
    </>
  );
};

export default Profiler;

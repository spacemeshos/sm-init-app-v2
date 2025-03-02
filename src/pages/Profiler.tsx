import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BackgroundImage from '../assets/banner4.png';
import File from '../assets/file.png';
import InfoIcon from '../assets/help.png';
import Gear from '../assets/setting.png';
import { BackButton, Button, CloseButton } from '../components/button';
import CustomNumberInput from '../components/input';
import Modal from '../components/modal';
import { SelectDirectory } from '../components/pos/SelectDirectory';
import ProfilerTable from '../components/ProfilerTable';
import { Tile, ActionTile, CoverTile } from '../components/tile';
import { useProfiler } from '../hooks/useProfiler';
import useTileHover from '../hooks/useTileHover';
import Colors from '../styles/colors';
import { Background, PageTitleWrapper } from '../styles/containers';
import { BodyText, Header } from '../styles/texts';

// Assets

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

const OptionsContainer = styled.div`
  width: 1100px;
  height: 80px;
  position: relative;
  left: 0px;
  top: 0px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: felx-start;
  margin-bottom: 15px;
  gap: 15px;
`;

const StepsContainer = styled.div`
  width: 1100px;
  height: 250px;
  position: relative;
  left: 0px;
  top: 0px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  margin-bottom: 15px;
  gap: 5px;
`;

const Profiler: React.FC = () => {
  const navigate = useNavigate();
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use the custom hook for each tile
  const directoryTile = useTileHover();
  const provingTile = useTileHover();
  const resultsTile = useTileHover();

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
        width={800}
        height={600}
      >
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
      </Modal>

      {/* Main POSProfiler content */}

      <Background src={BackgroundImage} />
      <BackButton onClick={() => navigate('/')} />
      <PageTitleWrapper>
        <Header text="PoS Profiler" />
      </PageTitleWrapper>
      <ProfilerContainer>
        <OptionsContainer>
          {/* Info */}
          <Tile
            height={65}
            width={550}
            blurred
            backgroundColor={Colors.darkOpaque}
            onClick={() => setShowInfoModal(true)}
          >
            <BodyText
              top={0}
              text="The profiler helps estimate how much POS Data you can allocate. 
            Succesful proving within cycle gap is crucial for rewards eligibility."
            />
          </Tile>

          {/* Action Tiles */}
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
            icon={File}
            onClick={() => navigate('/config')}
          />
        </OptionsContainer>

        <StepsContainer>
          {/* Select Directory */}
          <Tile
            height={250}
            width={380}
            blurred
            backgroundColor={Colors.whiteOpaque}
            onMouseEnter={directoryTile.handleMouseEnter}
            onMouseLeave={directoryTile.handleMouseLeave}
          >
            {!directoryTile.isVisible ? (
              <CoverTile
                counter="1"
                heading="Select Directory"
                footer="Indicate where to store your POS data. The Profiler will test the chosen drive I/O speed and performance."
              />
            ) : (
              <div onClick={(e) => e?.stopPropagation()}>
                <SelectDirectory variant="compact" width={350} />
                <CloseButton
                  top={2}
                  left={95}
                  onClick={directoryTile.handleClose}
                />
              </div>
            )}
          </Tile>

          {/* Custom Proving Settings */}
          <Tile
            height={250}
            width={470}
            blurred
            backgroundColor={Colors.whiteOpaque}
            onMouseEnter={provingTile.handleMouseEnter}
            onMouseLeave={provingTile.handleMouseLeave}
          >
            {!provingTile.isVisible ? (
              <CoverTile
                counter="2"
                heading="Experiment with Proving Settings"
                footer="Test different values of these params to find optimal config. 
              Balance the probability and proving speed."
              />
            ) : (
              <>
                <Tile
                  heading="Nonces:"
                  footer="more nonces = bigger chance to prove on one pass"
                  height={150}
                  onClick={(e) => e?.stopPropagation()}
                >
                  <CustomNumberInput
                    min={PROFILER_CONSTANTS.MIN_NONCES}
                    max={PROFILER_CONSTANTS.MAX_NONCES}
                    step={16}
                    value={benchmarkSettings.nonces}
                    onChange={(val) => updateBenchmarkSettings({ nonces: val })}
                  />
                </Tile>
                <Tile
                  heading="CPU Cores:"
                  footer="more cores = faster proving"
                  height={150}
                  onClick={(e) => e?.stopPropagation()}
                >
                  <CustomNumberInput
                    min={1}
                    max={maxCores}
                    step={1}
                    value={benchmarkSettings.threads}
                    onChange={(val) =>
                      updateBenchmarkSettings({ threads: val })
                    }
                  />
                </Tile>
                <CloseButton
                  top={2}
                  left={95}
                  onClick={provingTile.handleClose}
                />
              </>
            )}
          </Tile>

          {/* Run Benchmark Button */}
          <Tile height={250} width={240} backgroundColor={Colors.whiteOpaque}>
            <CoverTile counter="3">
              <Button
                onClick={runCustomBenchmark}
                disabled={isRunning}
                label="Run Test"
                width={120}
                height={40}
                top={65}
                left={40}
              />
            </CoverTile>
          </Tile>
        </StepsContainer>

        {/* Table with test results history*/}

        <Tile
          height={250}
          width={1100}
          blurred
          backgroundColor={Colors.whiteOpaque}
          onMouseEnter={resultsTile.handleMouseEnter}
          onMouseLeave={resultsTile.handleMouseLeave}
        >
          {!resultsTile.isVisible ? (
            <CoverTile
              counter="4"
              heading="Compare your tests results and pick the best config"
              footer="Test different values of these params to find optimal config. 
              Balance the probability and proving speed."
            />
          ) : (
            <>
              <ProfilerTable
                benchmarks={benchmarks}
                onBenchmarkSelect={selectBenchmark}
                scrollRef={scrollRef}
                config={config}
                customNonces={benchmarkSettings.nonces}
                customThreads={benchmarkSettings.threads}
              />
              <CloseButton
                top={2}
                left={95}
                onClick={resultsTile.handleClose}
              />
            </>
          )}
        </Tile>
      </ProfilerContainer>
    </>
  );
};

export default Profiler;

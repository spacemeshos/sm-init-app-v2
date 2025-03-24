import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BackgroundImage from '../assets/wave2.png';
import { Button } from '../components/button';
import CircularProgress from '../components/CircularProgress';
import Modal from '../components/modal';
import { Tile } from '../components/tile';
import { usePOSProcess } from '../state/POSProcessContext';
import { useSettings } from '../state/SettingsContext';
import Colors from '../styles/colors';
import { Background, PageTitleWrapper } from '../styles/containers';
import { ErrorMessage, Header } from '../styles/texts';
import { Stage } from '../types/posProgress';
import { getDirectoryDisplay } from '../utils/directoryUtils';
import { calculateNumFiles, calculateTotalSize } from '../utils/sizeUtils';

const ProgressContainer = styled.div`
  width: 1000px;
  height: 600px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 170px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: auto;
  align-content: flex-start;
  justify-content: flex-start;
  gap: 5px;
`;

const DetailsContainer = styled.div`
  width: 590px;
  height: 325px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: auto;
  gap: 5px;
`;
const ButtonsContainer = styled.div`
  width: 1000px;
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

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { processState, stopProcess } = usePOSProcess();
  const {
    stage,
    details,
    isError,
    processId,
    isRunning,
    fileProgress,
    progress,
  } = processState;
  const { settings } = useSettings();
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  // Debug logging
  React.useEffect(() => {
    console.log('Progress state updated:', {
      stage,
      details,
      isError,
      processId,
      isRunning,
      fileProgress,
      progress,
    });
  }, [stage, details, isError, processId, isRunning, fileProgress, progress]);

  // Show error modal when error is detected
  React.useEffect(() => {
    if (isError && stage === Stage.Error) {
      console.log('Error detected, showing modal:', details);
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [isError, stage, details]);

  React.useEffect(() => {
    if (!isRunning && stage !== Stage.Complete && stage !== Stage.Error) {
      navigate('/generate');
    }
  }, [isRunning, stage, navigate]);

  const handleStopGeneration = async () => {
    try {
      await stopProcess();
      navigate('/generate');
    } catch (error) {
      console.error('Failed to stop POS generation:', error);
      navigate('/generate');
    }
  };

  // Calculate total files
  const totalFiles = calculateNumFiles(settings.numUnits, settings.maxFileSize);

  // Helper function to format progress display
  const getProgressDisplay = () => {
    if (!fileProgress) {
      return `0 of ${totalFiles} Files (0%)`;
    }
    const currentProgress = ((fileProgress.currentFile + 1) / totalFiles) * 100;
    return `${
      fileProgress.currentFile + 1
    } of ${totalFiles} Files (${Math.round(currentProgress)}%)`;
  };

  return (
    <>
      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          navigate('/generate');
        }}
        header="POS Generation Error"
        width={600}
        height={250}
        text={details}
      />
      
      <Background src={BackgroundImage} />
      <PageTitleWrapper>
        <Header text="POS Generation Progress" />
      </PageTitleWrapper>
      <ProgressContainer>
        {isError && <ErrorMessage text={details} />}
        <Tile
          height={50}
          width={1000}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={details}
        />
        <Tile
          height={325}
          width={405}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          <CircularProgress
            progress={progress}
            size={280}
            label="Generation Progress"
          />
        </Tile>
        <DetailsContainer>
          <Tile
            height={160}
            width={590}
            blurred
            backgroundColor={Colors.whiteOpaque}
            footer={`${settings.numUnits} Space Units`}
            heading="Total Size" 
          >
            <Header text={calculateTotalSize(settings.numUnits)} top={-5} />
          </Tile>

          <Tile
            height={160}
            width={590}
            blurred
            backgroundColor={Colors.whiteOpaque}
            heading= "Progress"
            footer="Generated"
          >
            <Header text={getProgressDisplay()} top={-5} />
          </Tile>
        </DetailsContainer>
        <Tile
          height={80}
          width={1000}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={getDirectoryDisplay(
            settings.selectedDir,
            settings.defaultDir
          )}
          footer="POS Location"
        />
        <ButtonsContainer>
          <Button
            label={stage === Stage.Complete ? 'Finished!' : 'Stop Generation'}
            onClick={handleStopGeneration}
            width={250}
            height={52}
            disabled={stage === Stage.Complete || stage === Stage.Error}
          />
          <Button
            label="Init another PoS data"
            onClick={() => navigate('/generate')}
            width={250}
            height={52}
          />
        </ButtonsContainer>
      </ProgressContainer>
    </>
  );
};

export default Progress;

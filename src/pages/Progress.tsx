import React from "react";
import styled from "styled-components";
import { usePOSProcess } from "../state/POSProcessContext";
import { Stage } from "../types/posProgress";
import BackgroundImage from "../assets/home.png";
import { BackButton, Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import {
  Background,
  MainContainer,
  PageTitleWrapper,
} from "../styles/containers";
import { BodyText, ErrorMessage, Header } from "../styles/texts";
import Frame from "../components/frames";
import { calculateNumFiles, calculateTotalSize } from "../utils/sizeUtils";
import { useSettings } from "../state/SettingsContext";

const ProgressContainer = styled.div`
  width: 800px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { processState, stopProcess } = usePOSProcess();
  const { stage, details, isError, processId, isRunning, fileProgress, progress } = processState;
  const { settings } = useSettings();

  // Debug logging
  React.useEffect(() => {
    console.log('Progress state updated:', { 
      stage, 
      details, 
      isError, 
      processId, 
      isRunning, 
      fileProgress,
      progress 
    });
  }, [stage, details, isError, processId, isRunning, fileProgress, progress]);

  React.useEffect(() => {
    if (!isRunning && stage !== Stage.Complete && stage !== Stage.Error) {
      navigate("/generate");
    }
  }, [isRunning, stage, navigate]);

  const handleStopGeneration = async () => {
    try {
      await stopProcess();
      navigate("/generate");
    } catch (error) {
      console.error("Failed to stop POS generation:", error);
      navigate("/generate");
    }
  };

  // Calculate total files
  const totalFiles = calculateNumFiles(settings.numUnits, settings.maxFileSize);

  // Helper function to format progress display
  const getProgressDisplay = () => {
    if (!fileProgress) {
      return `0 of ${totalFiles} Files (0%)`;
    }
    return `${fileProgress.currentFile + 1} of ${totalFiles} Files (${Math.round(progress)}%)`;
  };

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton />
      <MainContainer>
        <PageTitleWrapper>
          <Header text="POS Generation Progress" />
        </PageTitleWrapper>
        <ProgressContainer>
          <Header text="Current Progress" top={10} />
          <BodyText text={`Status: ${details}`} />
          {isError && <ErrorMessage>{details}</ErrorMessage>}
          <Frame
            height={18}
            heading="POS Size"
            subheader={`${settings.numUnits} Space Units (${calculateTotalSize(
              settings.numUnits
            )})`}
          />
          <Frame
            height={18}
            heading="File Size"
            subheader={`${totalFiles} files will be generated, ${settings.maxFileSize} MiB each`}
          />
          <Frame
            height={18}
            heading="Already generated"
            subheader={getProgressDisplay()}
          />

          <Button
            label="Stop Generation"
            onClick={handleStopGeneration}
            width={250}
            height={56}
            disabled={stage === Stage.Complete || stage === Stage.Error}
          />
        </ProgressContainer>
        <BodyText text={`Process ID: ${processId}`} />
      </MainContainer>
    </>
  );
};

export default Progress;

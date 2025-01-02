import React from "react";
import styled from "styled-components";
import { usePOSProcess } from "../state/POSProcessContext";
import { Stage } from "../types/posProgress";
import BackgroundImage from "../assets/wave2.png";
import { Button } from "../components/button";
import CircularProgress from "../components/CircularProgress";
import { useNavigate } from "react-router-dom";
import { Background, PageTitleWrapper } from "../styles/containers";
import { ErrorMessage, Header } from "../styles/texts";
import { calculateNumFiles, calculateTotalSize } from "../utils/sizeUtils";
import { getDirectoryDisplay } from "../utils/directoryUtils";
import { useSettings } from "../state/SettingsContext";
import {Tile} from "../components/tile";
import Colors from "../styles/colors";

const ProgressContainer = styled.div`
  width: 810px;
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

  // Debug logging
  React.useEffect(() => {
    console.log("Progress state updated:", {
      stage,
      details,
      isError,
      processId,
      isRunning,
      fileProgress,
      progress,
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
    const currentProgress = ((fileProgress.currentFile + 1) / totalFiles) * 100;
    return `${
      fileProgress.currentFile + 1
    } of ${totalFiles} Files (${Math.round(currentProgress)}%)`;
  };

  return (
    <>
      <Background src={BackgroundImage} />
      <PageTitleWrapper>
        <Header text="POS Generation Progress" />
      </PageTitleWrapper>
      <ProgressContainer>
        {isError && <ErrorMessage>{details}</ErrorMessage>}
        <Tile
          height={50}
          width={810}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={details}
        />
        <Tile
          height={310}
          width={400}
          blurred
          backgroundColor={Colors.whiteOpaque}
        >
          <CircularProgress
            progress={fileProgress ? ((fileProgress.currentFile + 1) / totalFiles) * 100 : 0}
            size={250}
            label="Generation Progress"
          />
        </Tile>
        <DetailsContainer>
          <Tile
            height={150}
            width={400}
            blurred
            backgroundColor={Colors.whiteOpaque}
            subheader={`${settings.numUnits} Space Units`}
            heading={calculateTotalSize(settings.numUnits)}
          />

          <Tile
            height={150}
            width={400}
            blurred
            backgroundColor={Colors.whiteOpaque}
            heading={getProgressDisplay()}
            subheader="Generated"
          />
        </DetailsContainer>
        <Tile
          height={80}
          width={810}
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
            label="Stop Generation"
            onClick={handleStopGeneration}
            width={250}
            height={52}
            disabled={stage === Stage.Complete || stage === Stage.Error}
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
      </ProgressContainer>
    </>
  );
};

export default Progress;

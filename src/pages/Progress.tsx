import React from "react";
import styled from "styled-components";
import { usePOSProcess } from "../state/POSProcessContext";
import { Stage } from "../types/posProgress";
import BackgroundImage from "../assets/wave2.png";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { Background, PageTitleWrapper } from "../styles/containers";
import { BodyText, ErrorMessage, Header } from "../styles/texts";
import { calculateNumFiles, calculateTotalSize } from "../utils/sizeUtils";
import { getDirectoryDisplay } from "../utils/directoryUtils";
import { useSettings } from "../state/SettingsContext";
import Tile from "../components/tile";
import Colors from "../styles/colors";

const ProgressContainer = styled.div`
  width: 800px;
  height: 650px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 200px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  padding: 20px;
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
    return `${
      fileProgress.currentFile + 1
    } of ${totalFiles} Files (${Math.round(progress)}%)`;
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
          height={80}
          width={800}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="Status"
          heading={details}
        />
        <Tile
          height={80}
          width={800}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="placeholder for progress bar"
        />

        <Tile
          height={150}
          width={220}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="POS Size"
          subheader={`${settings.numUnits} Space Units`}
          heading={calculateTotalSize(settings.numUnits)}
        />

        <Tile
          height={150}
          width={220}
          blurred
          backgroundColor={Colors.whiteOpaque}
          footer="File Size"
          heading={`${totalFiles} files`}
          subheader={`${settings.maxFileSize} MiB each`}
        />

        <Tile
          height={150}
          width={300}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={getProgressDisplay()}
          subheader="Generated"
        />

        <Tile
          height={80}
          width={800}
          blurred
          backgroundColor={Colors.whiteOpaque}
          heading={getDirectoryDisplay(
            settings.selectedDir,
            settings.defaultDir
          )}
          footer="POS Location"
        />

        <Button
          label="Stop Generation"
          onClick={handleStopGeneration}
          width={250}
          height={56}
          disabled={stage === Stage.Complete || stage === Stage.Error}
        />
        <Button
          label="View full config"
          onClick={() => navigate("/config")} //TO DO
          width={250}
          height={56}
          disabled={stage === Stage.Complete || stage === Stage.Error}
        />
      </ProgressContainer>
      <BodyText text={`Process ID: ${processId}`} />
    </>
  );
};

export default Progress;

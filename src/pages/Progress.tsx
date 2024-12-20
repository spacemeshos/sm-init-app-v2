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
import { BodyText, ErrorMessage, Header, Subheader } from "../styles/texts";
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
  const { stage, details, isError, processId, isRunning } = processState;
  const { settings } = useSettings();

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
            subheader={`${calculateNumFiles(
              settings.numUnits,
              settings.maxFileSize
            )} files will be generated, ${settings.maxFileSize} MiB each`}
          />
          <Frame
            height={18}
            heading="Already generated"
            subheader={`${
              processState.progress
            } Files`}
          />

          <Button
            label="Stop Generation"
            onClick={handleStopGeneration}
            width={250}
            height={56}
            disabled={stage === Stage.Complete || stage === Stage.Error}
          />
        </ProgressContainer>
        <BodyText text={`Process ID: ${processState.processId}`} />
      </MainContainer>
    </>
  );
};

export default Progress;

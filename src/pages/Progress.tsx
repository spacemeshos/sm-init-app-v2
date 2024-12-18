import React from "react";
import styled from "styled-components";
import { usePOSProcess } from "../state/POSProcessContext";
import { Stage } from "../types/posProgress";
import Colors from "../styles/colors";
import BackgroundImage from "../assets/home.png";
import { BackButton, Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { Background, MainContainer } from "../styles/containers";
import { BodyText, ErrorMessage, Header } from "../styles/texts";

const StopButton = styled(Button)`
  position: absolute;
  bottom: 20px;
`;

const ProgressContainer = styled.div`
  width: 800px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 40px;
  display: flex;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${Colors.grayLight};
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  width: ${props => Math.min(props.width, 100)}%;
  height: 100%;
  background-color: ${Colors.greenLight};
  transition: width 0.3s ease;
`;

 const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { processState, stopProcess } = usePOSProcess();
  const { stage, progress, details, isError, processId, isRunning } = processState;

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
        <ProgressContainer>
          <Header text="POS Generation Progress" />

          {processId && <BodyText>Process ID: {processId}</BodyText>}

          <ProgressBar>
            <ProgressFill width={progress} />
          </ProgressBar>

          {isError ? (
            <ErrorMessage>{details}</ErrorMessage>
          ) : (
            <BodyText>{details}</BodyText>
          )}
        </ProgressContainer>
        <StopButton
          label="Stop Generation"
          onClick={handleStopGeneration}
          width={250}
          height={56}
          disabled={stage === Stage.Complete || stage === Stage.Error}
        />
      </MainContainer>
    </>
  );
};

export default Progress;

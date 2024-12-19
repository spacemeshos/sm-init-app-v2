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
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 50px;
`;

const ProgressSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProgressLabel = styled(BodyText)`
  margin-bottom: 5px;
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

const DetailText = styled(BodyText)`
  color: ${Colors.greenLight};
  font-size: 14px;
  margin-top: 5px;
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

          <ProgressSection>
            <ProgressLabel>Overall Progress</ProgressLabel>
            <ProgressBar>
              <ProgressFill width={progress} />
            </ProgressBar>
            <DetailText>{details}</DetailText>
          </ProgressSection>

          {processState.fileProgress && (
            <ProgressSection>
              <ProgressLabel>Current File Progress</ProgressLabel>
              <ProgressBar>
                <ProgressFill 
                  width={
                    (processState.fileProgress.currentLabels / 
                    processState.fileProgress.targetLabels) * 100 || 0
                  } 
                />
              </ProgressBar>
              <DetailText>
                File {processState.fileProgress.currentFile + 1} of {processState.fileProgress.totalFiles}
                {processState.fileProgress.targetLabels > 0 && ` • ${processState.fileProgress.currentLabels} of ${processState.fileProgress.targetLabels} labels`}
              </DetailText>
            </ProgressSection>
          )}

          {isError && <ErrorMessage>{details}</ErrorMessage>}
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

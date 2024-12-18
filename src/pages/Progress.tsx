import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BackButton, Button } from "../components/button";
import { usePOSProcess } from "../state/POSProcessContext";
import BackgroundImage from "../assets/home.png";
import { Background, MainContainer } from "../styles/containers";

const StopButton = styled(Button)`
  position: absolute;
  bottom: 20px;
`;

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { processState, stopProcess } = usePOSProcess();

  const handleStopGeneration = async () => {
    try {
      await stopProcess();
      // Navigate back to generate page after stopping
      navigate('/generate');
    } catch (error) {
      console.error('Failed to stop POS generation:', error);
      // Still navigate back even if there's an error, as the process state will be reset
      navigate('/generate');
    }
  };

  // If there's no process running, redirect back to generate page
  if (!processState.isRunning) {
    navigate('/generate');
    return null;
  }

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton />
      <MainContainer>
        <StopButton
          label="Stop Generation"
          onClick={handleStopGeneration}
          width={250}
          height={56}
        />
      </MainContainer>
    </>
  );
};

export default Progress;

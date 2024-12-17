import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { usePOSProcess } from "../state/POSProcessContext";
import Colors from "../styles/colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: ${Colors.greenDark};
`;

const StopButton = styled(Button)`
  margin-top: 20px;
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
    <Container>
      <StopButton
        label="Stop Generation"
        onClick={handleStopGeneration}
        width={250}
        height={56}
      />
    </Container>
  );
};

export default Progress;

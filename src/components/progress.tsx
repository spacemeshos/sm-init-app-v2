import React from "react";
import Colors from "../styles/colors";
import styled from "styled-components";

interface ProgressBarProps {
  progress: number;
}

const BarWrapper = styled.div`
  height: 2px;
  width: 1200px;
  background: transparent;
  position: absolute;
  top: 117px;
  left: 0px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Frame = styled.div`
  border: 1px solid ${Colors.greenDark};
  width: 750px;
  height: 2px;
  background-color: ${Colors.background};
  overflow: hidden;
`;

const Filler = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: linear-gradient(90deg, ${Colors.greenDark} 28%, ${Colors.greenLight} 100%);
  transition: width 0.3s ease-in-out;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const validProgress = Math.min(100, Math.max(0, progress));

  return (
    <BarWrapper>
      <Frame>
        <Filler progress={validProgress} />
      </Frame>
    </BarWrapper>
  );
};

export default ProgressBar;

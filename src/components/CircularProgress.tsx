import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number; // Size in pixels
  strokeWidth?: number; // Width of the progress circle
  label?: string; // Optional label to show in the center
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Calculate SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  const center = size / 2;

  return (
    <Container>
      <SVGCircle
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={Colors.greenLightOpaque}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <ProgressPath
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={Colors.greenLight}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </SVGCircle>
      <TextContainer>
        <ProgressText>{Math.round(normalizedProgress)}%</ProgressText>
        {label && <Label>{label}</Label>}
      </TextContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SVGCircle = styled.svg`
  transform: rotate(-90deg);
`;

const ProgressPath = styled.circle`
  transition: stroke-dashoffset 0.35s;
  transform-origin: center;
  transform: rotate(0deg);
`;

const TextContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProgressText = styled.span`
  font-family: "Univers55", sans-serif;
  color: ${Colors.greenLight};
  font-size: 24px;
  font-weight: 500;
`;

const Label = styled.span`
  font-family: "Univers55", sans-serif;
  color: ${Colors.white};
  font-size: 14px;
  margin-top: 4px;
`;

export default CircularProgress;

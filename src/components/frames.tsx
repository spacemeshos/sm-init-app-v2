import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface FrameProps {
  heading?: string;
  subheader?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}

const Wrapper = styled.div<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}>`
  background-color: ${Colors.whiteOpaque};
  position: relative;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  height: ${({ height }) => height || 100}%;
  width: ${({ width }) => width || 100}%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border: 0.5px solid ${Colors.greenLightOpaque};
`;

const FrameHeading = styled.h2`
  color: ${Colors.white};
  font-family: "Source Code Pro", sans-serif;
  left: 20px;
  text-align: left;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.white};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  position: absolute;
  text-align: right;
  right: 20px;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
`;

const Frame: React.FC<FrameProps> = ({
  heading,
  subheader,
  children,
  height,
  left,
  top,
  width,
}) => {
  return (
    <Wrapper
      top={top}
      left={left}
      height={height}
      width={width}
    >
      <FrameHeading>{heading}</FrameHeading>
      <SubHeader>{subheader}</SubHeader>
      {children}
    </Wrapper>
  );
};

export default Frame;

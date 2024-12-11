import * as React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";
import { Header, Subheader } from "../styles/texts";

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

const FrameHeading = styled.div`
  position: absolute;
  left: 20px;
  text-align: left;
  width: auto;
`;

const Details = styled.div`
  position: absolute;
  text-align: right;
  right: 20px;
  width: auto;
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
    <Wrapper top={top} left={left} height={height} width={width}>
      <FrameHeading>
        <Header text={heading} />
      </FrameHeading>
      <Details>
        <Subheader text={subheader} />
      </Details>
      {children}
    </Wrapper>
  );
};

export default Frame;

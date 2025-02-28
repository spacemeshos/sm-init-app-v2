import * as React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";
import { BodyText, Subheader } from "../styles/texts";

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
  $isActive?: boolean;
  disabled?: boolean;
}

const Wrapper = styled.div<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  onClick?: () => void;
  $isActive?: boolean;
  disabled?: boolean;
}>`
  background-color: ${Colors.darkOpaque};
  position: relative;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  height: ${({ height }) => height || 80}px;
  width: ${({ width }) => width || 100}%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  align-content: center;
  border: 0.5px solid ${Colors.greenLightOpaque};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  &:hover {
    background: ${Colors.greenLightOpaque};
  }
`;

const FrameHeading = styled.div`
  position: absolute;
  left: 40px;
  text-align: left;
  width: auto;
`;

const Details = styled.div`
  position: absolute;
  text-align: right;
  right: 40px;
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
  $isActive,
  onClick,
  disabled,
}) => {
  return (
    <Wrapper
      top={top}
      left={left}
      height={height}
      width={width}
      onClick={onClick}
      $isActive={$isActive}
      disabled={disabled}
    >
      <FrameHeading>
        <Subheader text={heading} top={0} />
      </FrameHeading>
      <Details>
        <BodyText text={subheader} top={0} />
      </Details>
      {children}
    </Wrapper>
  );
};

export default Frame;

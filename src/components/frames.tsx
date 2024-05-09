import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface FrameProps {
  heading?: string;
  subheader?: string;
  footer?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  top?: number;
  left?: number;
  height: number;
  width: number;
  borderColor?: any;
}

const Wrapper = styled.div<{
  top?: number;
  left?: number;
  height: number;
  width: number;
  borderColor?: string;
}>`
  background-color: ${Colors.background};
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ borderColor }) => borderColor || "transparent"};
  border-image: ${({ borderColor }) =>
    borderColor
      ? "none"
      : `linear-gradient(
          90deg,
          ${Colors.greenLight} 0%,
          ${Colors.greenDark} 50%,
          ${Colors.greenLight} 100%
        ) 1`};
`;

const FrameHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  left: 20px;
  text-align: left;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  position: absolute;
  text-align: right;
  right: 20px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
`;

const Footer = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif, Arial;
  bottom: 5%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
`;

const Frame: React.FC<FrameProps> = ({
  heading,
  subheader,
  footer,
  children,
  height,
  left,
  top,
  width,
  borderColor,
}) => {
  return (
    <Wrapper
      top={top}
      left={left}
      height={height}
      width={width}
      borderColor={borderColor}
    >
      <FrameHeading>{heading}</FrameHeading>
      <SubHeader>{subheader}</SubHeader>
      <Footer>{footer}</Footer>
      {children}
    </Wrapper>
  );
};

export default Frame;

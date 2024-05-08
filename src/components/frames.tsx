import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface FrameProps {
  heading?: string;
  subheader?: string;
  footer?: string;
  imageSrc?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  wrapperTop?: number;
  wrapperLeft?: number;
  wrapperHeight: number;
  wrapperWidth: number;
}

const GreenWrapper = styled.div<{ wrapperTop?: number; wrapperLeft?: number; wrapperHeight: number; wrapperWidth: number }>`
  border: 1px solid transparent;
  background-color: ${Colors.background};
  position: absolute;
  top: ${({ wrapperTop }) => wrapperTop}px;
  left: ${({ wrapperLeft }) => wrapperLeft}px;
  height: ${({ wrapperHeight }) => wrapperHeight}px;
  width: ${({ wrapperWidth }) => wrapperWidth}px;

  display: flex;
  justify-content: center;

  /* Gradient border - example with a direction */
  border-image:   linear-gradient(
    90deg,
    ${Colors.greenLight} 0%,
    ${Colors.greenDark} 50%,
    ${Colors.greenLight} 100%
  );
  border-image-slice: 1;


`;

const FrameHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  margin: 35px 15px 0px;
  left: 10px;
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
  top: 20%;
  position: absolute;
  text-align: right;
  right: 10px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
`;

const Image = styled.img<{ top?: number; left?: number; height?: number; width?: number }>`
  aspect-ratio: 1;
  object-fit: contain;
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
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

const GreenFrame: React.FC<FrameProps> = ({ heading, subheader, imageSrc, footer, children, wrapperHeight, wrapperLeft, wrapperTop, wrapperWidth}) => {
  return (
    <GreenWrapper wrapperHeight={wrapperHeight} wrapperLeft={wrapperLeft} wrapperTop={wrapperTop} wrapperWidth={wrapperWidth}>
      <FrameHeading>{heading}</FrameHeading>
      <SubHeader>{subheader}</SubHeader>
      {imageSrc && <Image src={imageSrc} alt="Descriptive text here" />}
      <Footer>{footer}</Footer>
      {children}
    </GreenWrapper>
  );
};

export default GreenFrame;

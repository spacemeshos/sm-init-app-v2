import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface TextProps {
  text?: string;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

const StyledTitle = styled.h1<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  text-align: ${({ left }) => (left == null ? "center" : "left")};
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: 4px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => (left == null ? "50%" : `${left}px`)};
  transform: ${({ left }) => (left == null ? "translateX(-50%)" : "none")};
  position: relative;
`;

const StyledSubheader = styled.h2<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro Extralight";
  text-align: ${({ left }) => (left == null ? "center" : "left")};
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 100;
  letter-spacing: 4px;
  top: ${({ top }) => top}px;
  position: relative;
`;
const StyledBody = styled.h3<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.white};
  font-family: "Source Code Pro Extralight";
  text-align: "center";
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 100;
  letter-spacing: 2px;
  top: ${({ top }) => top}px;
  position: relative;
`;

const ErrorMsg = styled.h3<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.red};
  font-family: "Source Code Pro Extralight";
  text-align: "center";
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 200;
  letter-spacing: 2px;
  position: relative;
`;

const Title: React.FC<TextProps> = ({ text, top, left }) => {
  return (
    <StyledTitle top={top} left={left}>
      {text}
    </StyledTitle>
  );
};

const Subheader: React.FC<TextProps> = ({ text, top, left }) => {
  return (
    <StyledSubheader top={top} left={left}>
      {text}
    </StyledSubheader>
  );
};

const BodyText: React.FC<TextProps> = ({ text, top, left }) => {
  return (
    <StyledBody top={top} left={left}>
      {text}
    </StyledBody>
  );
};

const ErrorMessage: React.FC<TextProps> = ({ text, children }) => {
  return (
    <ErrorMsg>
      {text}
      {children}
    </ErrorMsg>
  );
};

export { Title, Subheader, BodyText, ErrorMessage };

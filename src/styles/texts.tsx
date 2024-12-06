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
  font-family: "Univers93", sans-serif;
  text-align: ${({ left }) => (left == null ? "center" : "left")};
  white-space: nowrap;
  font-size: 30px;
  letter-spacing: 3px;
  text-transform: uppercase;
  top: ${({ top }) => top}px;
  left: ${({ left }) => (left == null ? "50%" : `${left}px`)};
  transform: ${({ left }) => (left == null ? "translateX(-50%)" : "none")};
  position: relative;
`;

const StyledHeader = styled.h1<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.grayLight};
  font-family: 'Univers65', sans-serif;
  text-align: ${({ left }) => (left == null ? "center" : "left")};
  white-space: nowrap;
  font-size: 20px;
  letter-spacing: 1px;
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
  font-family: 'Univers55', sans-serif;
  text-align: ${({ left }) => (left == null ? "center" : "left")};
  white-space: nowrap;
  font-size: 16px;
  top: ${({ top }) => top}px;
  position: relative;
`;

const StyledBody = styled.h3<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.white};
  font-family: 'Univers45', sans-serif;
  text-align: "center";
  white-space: nowrap;
  font-size: 14px;
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

const Header: React.FC<TextProps> = ({ text, top, left }) => {
  return (
    <StyledHeader top={top} left={left}>
      {text}
    </StyledHeader>
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

export {Title, Header, Subheader, BodyText, ErrorMessage };

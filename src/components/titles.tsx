import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface TitleProps {
  text: string;
  top?: number;
  left?: number;
}

const Title: React.FC<TitleProps> = ({ text, top, left }) => {
  return (
    <StyledTitle top={top} left={left}>
      {text}
    </StyledTitle>
  );
};

const StyledTitle = styled.h1<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  text-align: ${({ left }) => left == null ? 'center' : 'left'};
    white-space: nowrap;
  text-transform: uppercase;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: 4px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left == null ? '50%' : `${left}px`};
  transform: ${({ left }) => left == null ? 'translateX(-50%)' : 'none'};
  position: absolute;
`;

const Subheader: React.FC<TitleProps> = ({ text, top, left }) => {
  return (
    <StyledSubheader top={top} left={left}>
      {text}
    </StyledSubheader>
  );
};

const StyledSubheader = styled.h2<{
  top?: number;
  left?: number;
}>`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro Extralight";
  text-align: ${({ left }) => left == null ? 'center' : 'left'};
    white-space: nowrap;
  text-transform: uppercase;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: 4px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left == null ? '50%' : `${left}px`};
  transform: ${({ left }) => left == null ? 'translateX(-50%)' : 'none'};
  position: absolute;
`;



export {Title, Subheader};

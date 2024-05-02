import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";


interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return <StyledTitle>{text}</StyledTitle>;
};

const StyledTitle = styled.h1`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: 4px;
`;

export default Title;

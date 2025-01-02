import * as React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";

interface TextProps {
  text?: React.ReactNode;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

interface ListProps {
  items: React.ReactNode[];
  bulletColor?: string;
  itemColor?: string;
  bulletSymbol?: string;
  itemSpacing?: number;
  width?: string;
  maxWidth?: string;
}

const StyledTitle = styled.h1<{
  top?: number;
  left?: number;
}>`
  font-family: "Univers93", sans-serif;
  color: ${Colors.greenLight};
  text-align: "center";
  white-space: nowrap;
  font-size: 32px;
  letter-spacing: 3px;
  text-transform: uppercase;
  top: ${({ top }) => `${top ?? 20}px`};
  left: ${({ left }) => `${left ?? ""}px`};
  position: relative;
`;

const StyledHeader = styled.h1<{
  top?: number;
  left?: number;
}>`
  font-family: "Univers65", sans-serif;
  color: ${Colors.grayLight};
  text-align: "center";
  white-space: nowrap;
  font-size: 28px;
  letter-spacing: 2px;
  top: ${({ top }) => `${top ?? 20}px`};
  left: ${({ left }) => `${left ?? ""}px`};
  position: relative;
`;

const StyledSubheader = styled.h2<{
  top?: number;
  left?: number;
}>`
  font-family: "Univers55", sans-serif;
  color: ${Colors.grayLight};
  font-weight: 100;
  text-align: "center";
  white-space: nowrap;
  font-size: 18px;
  letter-spacing: 1px;
  top: ${({ top }) => `${top ?? 20}px`};
  left: ${({ left }) => `${left ?? ""}px`};
  position: relative;
`;

const StyledBody = styled.h3<{
  top?: number;
  left?: number;
}>`
  font-family: "Univers45", sans-serif;
  color: ${Colors.white};
  text-align: "center";
  white-space: pre-wrap;
  font-size: 14px;
  font-weight: 100;
  letter-spacing: 1px;
  top: ${({ top }) => `${top ?? 20}px`};
  left: ${({ left }) => `${left ?? ""}px`};
  position: relative;
  padding: 0 20px;
`;

const ErrorMsg = styled.h3<{
  top?: number;
  left?: number;
}>`
  font-family: "Univers45", sans-serif;
  color: ${Colors.red};
  text-align: "center";
  font-size: 14px;
  font-weight: 200;
  top: ${({ top }) => `${top ?? 20}px`};
  left: ${({ left }) => `${left ?? ""}px`};
  letter-spacing: 2px;
  position: relative;
`;

const StyledList = styled.ul<{
  width?: string;
  maxWidth?: string;
  itemSpacing?: number;
}>`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
  width: ${({ width }) => width || "80%"};
  max-width: ${({ maxWidth }) => maxWidth || "400px"};
`;

const StyledListItem = styled.li<{
  bulletColor?: string;
  itemColor?: string;
  bulletSymbol?: string;
  itemSpacing?: number;
}>`
  color: ${({ itemColor }) => itemColor || Colors.white};
  margin: ${({ itemSpacing }) => itemSpacing || 12}px 0;
  padding-left: 20px;
  font-family: "Univers45", sans-serif;
  font-weight: 100;
  position: relative;
  &::before {
    content: "${({ bulletSymbol }) => bulletSymbol || "•"}";
    color: ${({ bulletColor }) => bulletColor || Colors.red};
    position: absolute;
    left: 0;
  }
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

const ErrorMessage: React.FC<TextProps> = ({ text, children, top, left }) => {
  return (
    <ErrorMsg top={top} left={left}>
      {text}
      {children}
    </ErrorMsg>
  );
};

const List: React.FC<ListProps> = ({
  items,
  bulletColor,
  itemColor,
  bulletSymbol,
  itemSpacing,
  width,
  maxWidth,
}) => {
  return (
    <StyledList width={width} maxWidth={maxWidth} itemSpacing={itemSpacing}>
      {items.map((item, index) => (
        <StyledListItem
          key={index}
          bulletColor={bulletColor}
          itemColor={itemColor}
          bulletSymbol={bulletSymbol}
          itemSpacing={itemSpacing}
        >
          {item}
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export { Title, Header, Subheader, BodyText, ErrorMessage, List };

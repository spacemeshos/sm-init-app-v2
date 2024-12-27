import * as React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";

export interface TileProps {
  heading?: string;
  subheader?: string;
  footer?: string;
  errmsg?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  selected?: boolean;
  backgroundColor?: string;
  blurred?: boolean;
  width?: number;
  height?: number;
}

const TileWrapper = styled.div<{
  selected?: boolean;
  height?: number;
  width?: number;
  backgroundColor?: string;
  blurred?: boolean;
}>`
  height: ${({ height = 450 }) => `${height}px`};
  width: ${({ width = 500 }) => `${width}px`};
  background-color: ${({ selected, backgroundColor = 'transparent' }) =>
    selected ? Colors.greenLightOpaque : backgroundColor};
  backdrop-filter: ${({ blurred }) => blurred ? 'blur(8px)' : 'none'};
  position: relative;
  display: flex;
  justify-content: center;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Univers55", sans-serif;
  margin: 10px 15px 0px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 16px;
  top: 5%;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Univers45", sans-serif;
  top: 35%;
  position: absolute;
  text-align: center;
  font-size: 14px;
  font-weight: 100;
`;

const ErrorMessage = styled.h3`
  color: ${Colors.red};
  font-family: "Univers55", sans-serif;
  top: 20%;
  position: absolute;
  text-align: center;
  font-size: 14px;
  font-weight: 200;
`;

const Footer = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Univers45", sans-serif;
  bottom: 10%;
  position: absolute;
  text-align: center;
  font-size: 14px;
  font-weight: 100;
`;

const Tile: React.FC<TileProps> = ({
  heading,
  subheader,
  footer,
  errmsg,
  children,
  onClick,
  selected,
  backgroundColor,
  blurred,
  width,
  height,
}) => {
  return (
    <TileWrapper 
      onClick={onClick} 
      selected={selected}
      backgroundColor={backgroundColor}
      blurred={blurred}
      width={width}
      height={height}
    >
      <TileHeading>{heading}</TileHeading>
      {!errmsg && <SubHeader>{subheader}</SubHeader>}
      {children}
      {errmsg && <ErrorMessage>{errmsg}</ErrorMessage>}
      <Footer>{footer}</Footer>
    </TileWrapper>
  );
};

export default Tile;

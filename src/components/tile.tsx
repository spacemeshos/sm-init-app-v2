import * as React from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';

import Image from './image';

export interface TileProps {
  heading?: string;
  subheader?: string;
  footer?: string;
  errmsg?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: (event?: React.MouseEvent) => void;
  selected?: boolean;
  backgroundColor?: string;
  blurred?: boolean;
  width?: number;
  height?: number;
  top?: number;
}

const TileWrapper = styled.div<{
  selected?: boolean;
  height?: number;
  width?: number;
  backgroundColor?: string;
  blurred?: boolean;
  top?: number;
}>`
  height: ${({ height = 450 }) => `${height}px`};
  width: ${({ width = 500 }) => `${width}px`};
  background-color: ${({ selected, backgroundColor = 'transparent' }) =>
    selected ? Colors.greenLightOpaque : backgroundColor};
  backdrop-filter: ${({ blurred }) => (blurred ? 'blur(8px)' : 'none')};
  position: relative;
  display: flex;
  justify-content: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  top: ${({ top }) => top || 0}px;
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: 'Univers55', sans-serif;
  margin: 0px 15px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 14px;
  top: 15px;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  top: 30%;
  position: absolute;
  text-align: center;
  font-size: 12px;
  font-weight: 100;
`;

const ErrorMessage = styled.h3`
  color: ${Colors.red};
  font-family: 'Univers55', sans-serif;
  top: 20%;
  position: absolute;
  text-align: center;
  font-size: 12px;
  font-weight: 200;
`;

const Footer = styled.h3`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  bottom: 10%;
  position: absolute;
  text-align: center;
  font-size: 12px;
  font-weight: 100;
  padding: 0px 20px;
`;

const CoverTileWrapper = styled.div<{
  onClick?: () => void;
}>`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  top: 0px;
  left: 0px;
`;

const CoverTileHeading = styled.h1`
  color: ${Colors.greenLight};
  font-family: 'Univers65', sans-serif;
  margin: 0px 15px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 18px;
  bottom: 40%;
  width: 60%;
  position: absolute;
`;

const CoverTileSubheader = styled.h3`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  bottom: 10%;
  position: absolute;
  text-align: center;
  font-size: 14px;
  font-weight: 100;
  line-height: 1.5;
  width: 85%;
`;

const TileCounter = styled.h3`
  font-family: 'Univers65', sans-serif;
  color: ${Colors.greenDark};
  position: absolute;
  font-size: 170px;
  top: -30px;
  left: 10px;
  opacity: 0.8;
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
  top,
}) => {
  return (
    <TileWrapper
      onClick={onClick}
      selected={selected}
      backgroundColor={backgroundColor}
      blurred={blurred}
      width={width}
      height={height}
      top={top}
    >
      <TileHeading>{heading}</TileHeading>
      {!errmsg && <SubHeader>{subheader}</SubHeader>}
      {children}
      {errmsg && <ErrorMessage>{errmsg}</ErrorMessage>}
      <Footer>{footer}</Footer>
    </TileWrapper>
  );
};

interface ActionTileProps {
  footer: string;
  icon: string;
  onClick: () => void;
}

const ActionTile: React.FC<ActionTileProps> = ({ footer, icon, onClick }) => (
  <Tile
    footer={footer}
    height={65}
    width={120}
    blurred
    backgroundColor={Colors.whiteOpaque}
    onClick={onClick}
  >
    <Image src={icon} width={25} top={10} />
  </Tile>
);

interface CoverTileProps {
  counter?: string;
  heading?: string;
  footer?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const CoverTile: React.FC<CoverTileProps> = ({
  counter,
  heading,
  footer,
  children,
  onClick,
}) => {
  return (
    <CoverTileWrapper onClick={onClick}>
      <CoverTileHeading>{heading}</CoverTileHeading>
      <TileCounter>{counter}</TileCounter>
      {children}
      <CoverTileSubheader>{footer}</CoverTileSubheader>
    </CoverTileWrapper>
  );
};

export { Tile, ActionTile, CoverTile };

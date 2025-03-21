import * as React from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';

import Image from './image';
import { blur } from '../styles/mixins';

export interface TileProps {
  heading?: string;
  subheader?: string;
  footer?: string;
  errmsg?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: (event?: React.MouseEvent) => void;
  onHover?: (event?: React.MouseEvent) => void;
  onMouseEnter?: (event?: React.MouseEvent) => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
  selected?: boolean;
  backgroundColor?: string;
  blurred?: boolean;
  horizontal?: boolean;
  width?: number;
  height?: number;
  top?: number;
  border?: boolean;
}

const TileWrapper = styled.div<{
  selected?: boolean;
  height?: number;
  width?: number;
  backgroundColor?: string;
  blurred?: boolean;
  horizontal?: boolean;
  top?: number;
  border?: boolean;
  onClick?: (event?: React.MouseEvent) => void;
  onHover?: (event?: React.MouseEvent) => void;
  onMouseEnter?: (event?: React.MouseEvent) => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
}>`
  height: ${({ height = 450 }) => `${height}px`};
  width: ${({ width = 500 }) => `${width}px`};
  background-color: ${({ selected, backgroundColor = 'transparent' }) =>
    selected ? Colors.greenLightOpaque : backgroundColor};
  ${({ blurred }) => blur(blurred ? '8px' : 'none')}
  border: ${({ border }) =>
    border ? `1px solid ${Colors.greenLightOpaque}` : 'none'};
  position: relative;
  display: flex;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  cursor: ${({ onClick, onHover }) =>
    onClick || onHover ? 'pointer' : 'default'};
  top: ${({ top }) => top || 0}px;
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: 'Univers55', sans-serif;
  margin: 0px 15px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 18px;
  top: 15px;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  top: 30%;
  position: absolute;
  text-align: center;
  font-size: 16px;
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
  font-size: 14px;
  font-weight: 100;
  padding: 0px 20px;
`;

const CoverTileWrapper = styled.div<{
  onClick?: () => void;
  onHover?: () => void;
  onMouseLeave?: () => void;
}>`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ onClick, onHover }) =>
    onClick || onHover ? 'pointer' : 'default'};
  top: 0px;
  left: 0px;
`;

const CoverTileHeading = styled.h1`
  color: ${Colors.greenLight};
  font-family: 'Univers65', sans-serif;
  text-align: left;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 18px;
  left: 120px;
  top: 40%;
  width: 60%;
  position: absolute;
`;

const CoverTileSubheader = styled.h3`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  position: absolute;
  top: 65%;
  text-align: justify;
  font-size: 14px;
  font-weight: 100;
  line-height: 1.5;
  width: 80%;
`;

const TileCounter = styled.h3`
  font-family: 'Univers65', sans-serif;
  color: ${Colors.greenDark};
  position: absolute;
  font-size: 170px;
  top: 30%;
  transform: translateY(-50%);
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
  onHover,
  onMouseEnter,
  onMouseLeave,
  selected,
  backgroundColor,
  blurred,
  horizontal,
  width,
  height,
  top,
  border,
}) => {
  return (
    <TileWrapper
      onClick={onClick}
      onMouseEnter={onMouseEnter || (onHover ? onHover : undefined)}
      onMouseLeave={onMouseLeave}
      onHover={onHover}
      selected={selected}
      backgroundColor={backgroundColor}
      blurred={blurred}
      horizontal={horizontal}
      width={width}
      height={height}
      top={top}
      border={border}
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
    width={130}
    blurred
    backgroundColor={Colors.darkOpaque}
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
  onHover?: () => void;
  onMouseLeave?: () => void;
}

const CoverTile: React.FC<CoverTileProps> = ({
  counter,
  heading,
  footer,
  children,
  onClick,
  onHover,
  onMouseLeave,
}) => {
  return (
    <CoverTileWrapper
      onHover={onHover}
      onClick={onClick}
      onMouseEnter={onHover ? onHover : undefined}
      onMouseLeave={onMouseLeave ? onMouseLeave : undefined}
    >
      <CoverTileHeading>{heading}</CoverTileHeading>
      <TileCounter>{counter}</TileCounter>
      {children}
      <CoverTileSubheader>{footer}</CoverTileSubheader>
    </CoverTileWrapper>
  );
};

export { Tile, ActionTile, CoverTile };

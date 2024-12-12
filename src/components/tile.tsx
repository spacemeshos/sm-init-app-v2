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
}

const TileWrapper = styled.div<{ selected?: boolean }>`
  background-color: ${({ selected }) =>
    selected ? Colors.greenLightOpaque : Colors.whiteOpaque};
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};

  /* Gradient border */
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
  border-image: linear-gradient(
    45deg,
    ${Colors.greenLightOpaque},
    ${Colors.whiteOpaque}
  );
  border-image-slice: 1;
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Univers55", sans-serif;
  margin: 35px 15px 0px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 100;
  font-size: 16px;
  top: 0px;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Univers45", sans-serif;
  top: 20%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
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
  bottom: 5%;
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
}) => {
  return (
    <TileWrapper onClick={onClick} selected={selected}>
      <TileHeading>{heading}</TileHeading>
      {!errmsg && <SubHeader>{subheader}</SubHeader>}
      {errmsg && <ErrorMessage>{errmsg}</ErrorMessage>}
      <Footer>{footer}</Footer>
      {children}
    </TileWrapper>
  );
};

export default Tile;

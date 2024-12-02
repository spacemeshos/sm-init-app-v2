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
  font-family: "Source Code Pro", sans-serif;
  margin: 35px 15px 0px;
  text-align: center;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 200;
  letter-spacing: 3px;
  width: 95%;
  top: 0px;
  position: absolute;
`;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  top: 20%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 95%;
`;

const ErrorMessage = styled.h3`
  color: ${Colors.red};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  top: 20%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 200;
  letter-spacing: 2px;
  width: 95%;
`;

const TileElement = styled.div`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -60%);
`;

const Footer = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  bottom: 5%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 95%;
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
      <TileElement>{children}</TileElement>
    </TileWrapper>
  );
};

export default Tile;

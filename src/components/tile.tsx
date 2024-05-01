import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { TileButton } from "./button";

interface TileProps {
  text: string;
  imageSrc?: string;
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
}

const TileWrapper = styled.div`
  border: 1px solid transparent;
  background-color: ${Colors.darkerGreen};
  transition: border-color 0.3s ease;
  height: 100%;
  width: 100%;
  position: absolute;

  display: flex;
  justify-content: center;

  /* Gradient border */
  border-image: linear-gradient(${Colors.greenLight}, ${Colors.greenDark});
  border-image-slice: 1;

  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  height: 90px;
  padding: 30px 15px;
  text-align: center;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 450px;
`;

const TileImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  left: 175px;
  top: 112px;
`;

const Tile: React.FC<TileProps> = ({ text, imageSrc, buttonText, onClick}) => {
  return (
    <TileWrapper>
      <TileHeading>{text}</TileHeading>
      {imageSrc && <TileImage src={imageSrc} alt="" />}
      <TileButton label={buttonText} onClick={onClick} />
    </TileWrapper>
  );
};

export default Tile;

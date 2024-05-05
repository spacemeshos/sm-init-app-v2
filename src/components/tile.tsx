import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface TileProps {
  heading?: string;
  subheader?: string;
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
  margin: 35px 15px 0px;
  text-align: center;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
  top: 0px;
  position: absolute;

  `;

const SubHeader = styled.h3`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  top: 15%;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
`;

const TileImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(
    -50%,
    -50%
  ); // Centers the image both horizontally and vertically
`;

const Tile: React.FC<TileProps> = ({ heading, subheader, imageSrc }) => {
  return (
    <TileWrapper>
      <TileHeading>{heading}</TileHeading>
      <SubHeader>{subheader}</SubHeader>
      {imageSrc && <TileImage src={imageSrc} alt="" />}
    </TileWrapper>
  );
};

export default Tile;

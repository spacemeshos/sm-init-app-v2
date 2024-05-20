import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

interface TileProps {
  heading?: string;
  subheader?: string;
  footer?: string;
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
`;

const TileHeading = styled.h2`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  margin: 35px 15px 0px;
  text-align: center;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 100;
  letter-spacing: 3px;
  width: 100%;
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
  width: 100%;
`;

const TileImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(
    -50%,
    -60%
  ); // Centers the image both horizontally and vertically
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
  width: 100%;
`;

const Tile: React.FC<TileProps> = ({
  heading,
  subheader,
  imageSrc,
  footer,
}) => {
  return (
    <TileWrapper>
      <TileHeading>{heading}</TileHeading>
      <SubHeader>{subheader}</SubHeader>
      {imageSrc && <TileImage src={imageSrc} alt="" />}
      <Footer>{footer}</Footer>
    </TileWrapper>
  );
};

export default Tile;

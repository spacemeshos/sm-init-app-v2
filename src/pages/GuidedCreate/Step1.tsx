import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  ForwardButton,
  TooltipButton,
} from "../../components/button";
import Title from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import { ExternalLinks } from "../../Shared/Constants";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 22px;
  top: 170px;

  position: absolute;
  color: ${Colors.grayDark};
  font-family: "Source Code Pro", monospace;
  font-optical-sizing: auto;
  font-weight: 100;
  font-height: 16px;
  font-style: normal;
  height: 22px;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const ContainerBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  top: 278px;
  width: 1200px;
  position: absolute;
`;
const DirWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 112px;
  display: flex;
  justify-content: center;
`;

const HintWrapper = styled.div`
  border: 1px solid transparent;
  background-color: ${Colors.darkerGreen};
  transition: border-color 0.3s ease;
  height: 370px;
  width: 450px;
  left: 637px;
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
const HintImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  top: 41px;
  left: 175px;
`;
const HintText = styled.div`
  width: 450px;
  height: 228px;
  top: 141px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: ${Colors.greenLight};
  font-family: "Source Code Pro", monospace;
  font-weight: 100;
  font-height: 16px;
  text-align: center;
  font-size: 22px;
  font-weight: 100;
  line-height: 35px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const Step1: React.FC = () => {
  const folder = require("../../assets/folder.png");
  const bulb = require("../../assets/light-bulb.png");
  const navigateToDocs = () => window.open(ExternalLinks.Docs);
  const navigateToDiscord = () => window.open(ExternalLinks.Discord);

  return (
    <>
      <NavProgress>
        <ProgressBar progress={33} />
        <BackButton />
        <ForwardButton />
      </NavProgress>
      <TextWrapper>
        <Title text="Your Path to Crypto Starts Here" />
        Whenever you feel lost, remember to read the tips,{" "}
        <a
          onClick={navigateToDocs}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Spacemesh docs
        </a>
        {", and "}
        <a
          onClick={navigateToDiscord}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Discord FAQ
        </a>
      </TextWrapper>
      <ContainerBottom>
        <DirWrapper>
          <Tile
            text={"Where to Store pos data?"}
            imageSrc={folder}
            buttonText="Choose directory"
            onClick={() => console.log("Button Clicked")} /* TO DO */
          />
          <TooltipButton
            modalTop={0}
            modalLeft={0}
            modalHeader="Test"
            modalText="dir"
            modalContent
          />
        </DirWrapper>

        <HintWrapper>
          <HintImage src={bulb} />
          <HintText>
            Next, we'll optimize your settings with a quick benchmark to boost
            your rewards and qualification chances every epoch
          </HintText>
          <TooltipButton
            modalTop={0}
            modalLeft={0}
            modalHeader="Test"
            modalText="dfghjkloikjuhygf"
            modalContent
          />
        </HintWrapper>
      </ContainerBottom>
    </>
  );
};

export default Step1;

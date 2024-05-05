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
import PosInfo from "../../components/pos_info";

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
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
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

const GPUWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 112px;
  display: flex;
  justify-content: center;
`;

const CPUWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 112px;
  display: flex;
  justify-content: center;
`;

const TailoredSettings: React.FC = () => {
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
        <GPUWrapper>
          <Tile
            text={"Where to Store pos data?"}
            imageSrc={folder}
            buttonText="Choose directory"
            onClick={() => console.log("Button Clicked")} /* TO DO */
          />
          <TooltipButton
            modalText={
              <>
                Use a reliable disk with at least 256 Gibibytes, preferring good
                read speed (HDDs suffice).
                <br />
                <br />
                Ensure PoS files remain accessible, as they're checked every 2
                weeks.
                <br />
                <br />
                Consider a dedicated disk or no other activity during proving
                windows for disk longevity.
                <br />
                <br />
                Read more:{" "}
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
              </>
            }
          />
        </GPUWrapper>

      </ContainerBottom>
    </>
  );
};

export default TailoredSettings;

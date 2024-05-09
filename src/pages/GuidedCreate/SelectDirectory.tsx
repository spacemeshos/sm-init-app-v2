import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  ForwardButton,
  Button,
  TooltipButton,
} from "../../components/button";
import {Subheader, Title} from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import { ExternalLinks } from "../../Shared/Constants";
import PosInfo from "../../components/pos_info";
import { useNavigate } from "react-router-dom";

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

const DirImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 100px;
  position: absolute;
  top: 110px;
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
  font-weight: 200;
  text-align: center;
  font-size: 22px;
  line-height: 35px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const SelectDirectory: React.FC = () => {
  const folder = require("../../assets/folder.png");
  const bulb = require("../../assets/light-bulb.png");
  const navigateToDocs = () => window.open(ExternalLinks.Docs);
  const navigateToDiscord = () => window.open(ExternalLinks.Discord);
  const navigate = useNavigate();
  const TailoredSettings = () => navigate("/guided/TailoredSettings");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={33} />
        <BackButton />
        <ForwardButton onClick={TailoredSettings} />
      </NavProgress>
      <TextWrapper>
        <Title text="Your Path to Crypto Starts Here" top={-20} />
        <Subheader text={""} top={50}></Subheader>
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
          <Tile heading={"Where to Store pos data?"} />
          <DirImage src={folder} />
          <Button
            onClick={() => console.log("Button Clicked")}
            label="Choose directory"
            top={260}
            left={0}
            width={320}
            backgroundColor={Colors.darkerPurple}
            borderColor={Colors.purpleLight}
            /* TO DO */
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
            TooltipButtonTop={96}
            TooltipButtonLeft={50}
          />
        </DirWrapper>

        <HintWrapper>
          <HintImage src={bulb} />
          <HintText>
            Next, we'll optimize your settings with a quick benchmark to boost
            your rewards and qualification chances every epoch
          </HintText>
          <TooltipButton
            modalComponent={PosInfo}
            TooltipButtonTop={96}
            TooltipButtonLeft={50}
          />
        </HintWrapper>
      </ContainerBottom>
    </>
  );
};

export default SelectDirectory;

import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  ForwardButton,
  TooltipButton,
} from "../../components/button";
import { Title } from "../../components/texts";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import { ExternalLinks } from "../../shared/Constants";
import PosInfo from "../../components/pos_info";
import { useNavigate } from "react-router-dom";
import { open } from "@tauri-apps/api/shell";
import bulb from "../../assets/light-bulb.png";
import { SelectDirectory } from "../../components/setupPOS";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 22px;
  top: 160px;
  position: absolute;
  color: ${Colors.grayMedium};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 14px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const ContainerBottom = styled.div`
  display: flex;
  flex: none;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  top: 278px;
  width: 1200px;
  height: 400px;
  position: absolute;
`;

const HintWrapper = styled.div`
  height: 350px;
  width: 450px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const HintText = styled.div`
  width: 425px;
  height: 230px;
  top: 170px;
  position: absolute;
  color: ${Colors.greenLight};
  font-family: "Source Code Pro", monospace;
  font-weight: 200;
  text-align: center;
  font-size: 18px;
  line-height: 35px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const ScreenSelectDirectory: React.FC = () => {
  // Functions to navigate to external links
  const navigateToDocs = () => open(ExternalLinks.Docs);
  const navigateToDiscord = () => open(ExternalLinks.Discord);

  const navigate = useNavigate();
  const TailoredSettings = () => navigate("/guided/TailoredSettings");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={33} />
        <BackButton />
        <ForwardButton onClick={TailoredSettings} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Your Path to Crypto Starts Here" top={-20} />
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
        {/* Directory selection section */}
        <SelectDirectory />
        {/* Hint section for additional information */}
        <HintWrapper>
          <Tile imageSrc={bulb} imageTop={10} />
          <HintText>
            Next, we&apos;ll optimize your settings with a quick benchmark to
            boost your rewards and qualification chances every epoch
          </HintText>
          <TooltipButton modalComponent={PosInfo} buttonTop={96} />
        </HintWrapper>
      </ContainerBottom>
    </>
  );
};

export default ScreenSelectDirectory;

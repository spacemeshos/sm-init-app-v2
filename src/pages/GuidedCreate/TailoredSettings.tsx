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
import PosInfo from "../../components/pos_info";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 100px;
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
  top: 325px;
  width: 1200px;
  position: absolute;
`;

const GPUWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  left: 75px;
  display: flex;
  justify-content: center;
`;

const CPUWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  left: 112px;
  display: flex;
  justify-content: center;
`;

const SizeWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  left: 112px;
  display: flex;
  justify-content: center;
`;

const TailoredSettings: React.FC = () => {
  const gpu = require("../../assets/graphics-card.png");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={66} />
        <BackButton />
        <ForwardButton />
      </NavProgress>
      <TextWrapper>
        <Title text="Settings Tailored for Your Hardware" />
        Customise freely to match your needs. Ensure settings enhance,
        <br />
        not hinder your smeshing experience.
        <TooltipButton
        modalComponent={PosInfo}
        TooltipButtonTop={100}
        TooltipButtonLeft={50}
      />
      </TextWrapper>
     

      <ContainerBottom>
        <GPUWrapper>
          <Tile text={"Where to Store pos data?"} imageSrc={gpu} />
        </GPUWrapper>
      </ContainerBottom>
    </>
  );
};

export default TailoredSettings;

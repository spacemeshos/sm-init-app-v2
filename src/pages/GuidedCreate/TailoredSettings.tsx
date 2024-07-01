import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  EditButton,
  ForwardButton,
  TooltipButton,
} from "../../components/button";
import { Title } from "../../components/texts";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import PosInfo from "../../components/pos_info";
import { useNavigate } from "react-router-dom";
import GPUedit from "./editGPU";
import CPUedit from "./editCPU";
import editSize from "./editSize";
import gpu from "../../assets/graphics-card.png";
import cpu from "../../assets/cpu.png";
import files from "../../assets/duplicate.png";

const NavProgress = styled.div`
  width: 100%;Azwsed4
  max-width: 1200px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  position: absolute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 100px;
  top: 170px;
  margin: 0 auto;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const ContainerBottom = styled.div`
  width: 1200px;
  height: 350px;
  top: 325px;
  display: flex;
  flex: none;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  position: absolute;
`;

const TileWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: relative;
  display: flex;
  justify-content: center;
`;

const TailoredSettings: React.FC = () => {
  //Hook to navigate to the next page - summary
  const navigate = useNavigate();
  const navigateToSummary = () => navigate("/guided/Summary");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={66} />
        <BackButton />
        <ForwardButton onClick={navigateToSummary} />
      </NavProgress>

      {/* Wrapper for title, subtitle and information icon button */}
      <TextWrapper>
        <Title text="Settings Tailored for Your Hardware" />
        Customise freely to match your needs. Ensure settings enhance,
        <br />
        not hinder your smeshing experience.
        <TooltipButton modalComponent={PosInfo} buttonTop={100} />
      </TextWrapper>

      {/*Bottom part of the page */}
      <ContainerBottom>
        {/* GPU settings section */}
        <TileWrapper>
          <Tile
            heading={"How to create POS?"}
            subheader={"placeholder"}
            imageSrc={gpu}
            footer="placeholder"
          />
          <EditButton modalComponent={GPUedit} />
        </TileWrapper>
        {/* Post prooving processor settings section */}
        <TileWrapper>
          <Tile
            heading={"How to prove POS?"}
            subheader={"placeholder"}
            imageSrc={cpu}
            footer="placeholder"
          />
          <EditButton modalComponent={CPUedit} />
        </TileWrapper>
        {/* Data size settings section */}
        <TileWrapper>
          <Tile
            heading={"How much POS data?"}
            subheader={"placeholder"}
            imageSrc={files}
            footer="placeholder"
          />
          <EditButton modalComponent={editSize} />
        </TileWrapper>
      </ContainerBottom>
    </>
  );
};

export default TailoredSettings;

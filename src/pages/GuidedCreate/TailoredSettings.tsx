import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  EditButton,
  ForwardButton,
  TooltipButton,
} from "../../components/button";
import { Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import ErrorModal from "../../components/error";
import PosInfo from "../../components/pos_info";
import { useNavigate } from "react-router-dom";
import GPUedit from "../../components/editGPU";
import CPUedit from "../../components/editCPU";

const NavProgress = styled.div`
  width: 100%;
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

const GPUWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  top: 325px;
  left: 75px;
  display: flex;
  justify-content: center;
`;

const CPUWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  top: 325px;
  left: 450px;
  display: flex;
  justify-content: center;
`;

const DataSizeWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
  top: 325px;
  left: 825px;
  display: flex;
  justify-content: center;
`;

const TailoredSettings: React.FC = () => {
  // Importing image assets
  const gpu = require("../../assets/graphics-card.png");
  const cpu = require("../../assets/cpu.png");
  const files = require("../../assets/duplicate.png");

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
        <TooltipButton
          modalComponent={PosInfo}
          buttonTop={100}
          buttonLeft={50}
        />
      </TextWrapper>
      {/*Bottom part of the page */}
      {/* GPU settings section */}
      <GPUWrapper>
        <Tile
          heading={"How to create POS?"}
          subheader={"placeholder"}
          imageSrc={gpu}
          footer="placeholder"
        />
        <EditButton
          modalComponent={GPUedit}
        />
      </GPUWrapper>
      {/* Post prooving processor settings section */}
      <CPUWrapper>
        <Tile
          heading={"How to prove POS?"}
          subheader={"placeholder"}
          imageSrc={cpu}
          footer="placeholder"
        />
        <EditButton
          modalComponent={CPUedit}
        />
      </CPUWrapper>
      {/* Data size settings section */}
      <DataSizeWrapper>
        <Tile
          heading={"How much POS data?"}
          subheader={"placeholder"}
          imageSrc={files}
          footer="placeholder"
        />
        <EditButton
          modalComponent={ErrorModal}
        />
      </DataSizeWrapper>
    </>
  );
};

export default TailoredSettings;

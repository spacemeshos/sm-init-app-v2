import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  EditButton,
  ForwardButton,
  IconButton,
} from "../../components/button";
import { Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import ErrorModal from "../../components/error";
import PosInfo from "../../components/pos_info";
import { useNavigate } from "react-router-dom";

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

const ContainerBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
  margin: 10px auto 0;
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
  left: 450px;
  display: flex;
  justify-content: center;
`;

const DataSizeWrapper = styled.div`
  height: 309px;
  width: 300px;
  position: absolute;
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
        <IconButton
          modalComponent={PosInfo}
          IconButtonTop={100}
          IconButtonLeft={50}
        />
      </TextWrapper>
      {/* Container for the bottom part of the page */}
      <ContainerBottom>
        {/* GPU settings section */}
        <GPUWrapper>
          <Tile
            heading={"How to create POS?"}
            subheader={"placeholder"}
            imageSrc={gpu}
            footer="placeholder"
          />
          <EditButton
            modalComponent={ErrorModal}
            EditButtonTop={96}
            EditButtonLeft={50}
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
            modalComponent={PosInfo}
            EditButtonTop={96}
            EditButtonLeft={50}
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
            modalComponent={PosInfo}
            EditButtonTop={96}
            EditButtonLeft={50}
          />
        </DataSizeWrapper>
      </ContainerBottom>
    </>
  );
};

export default TailoredSettings;

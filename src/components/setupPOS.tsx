import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { CancelButton, SaveButton } from "./button";
import CustomNumberInput from "./input";

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: -200px;
  opacity: 0.02;
`;

const BottomContainer = styled.div`
  height: 400px;
  width: 1200px;
  position: absolute;
  top: 270px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`;

const TileWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
`;

const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;

const SetupSize: React.FC = () => {
  const [dataSizeValue, setPOSsizeValue] = useState(256);
  const [fileSizeValue, setFileSizeValue] = useState(4096);
  const [isPOSInputVisible, setIsPOSInputVisible] = useState(true);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);

  const size = require("../assets/duplicate.png");

  const handleCancelCpu = () => {
    setPOSsizeValue(256); // Reset to default value
    setIsPOSInputVisible(true);
  };

  const handleSaveCpu = () => {
    setIsPOSInputVisible(false);
  };

  const handleCancelNonces = () => {
    setFileSizeValue(4096); // Reset to default value
    setIsFileInputVisible(true);
  };

  const handleSaveNonces = () => {
    setIsFileInputVisible(false);
  };

  return (
    <BottomContainer>
      <BgImage src={size} />

      <TileWrapper>
        <Tile
          heading="Select POS data size"
          subheader="Gibibytes"
          footer="more data -> more rewards, but longer data generation and proving"
        />
        {isPOSInputVisible ? (
          <>
            <CustomNumberInput
              min={256}
              max={999999}
              fontsize={36}
              height={80}
              step={64}
              value={256}
              onChange={(val) => setPOSsizeValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveCpu} />
            <CancelButton buttonLeft={45} onClick={handleCancelCpu} />
          </>
        ) : (
          <>
            <SelectedValue>{dataSizeValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelCpu} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select file size"
          subheader="Mebibytes"
          footer="POS will be stored across [XXX] files" //TODO
        />
        {isFileInputVisible ? (
          <>
            <CustomNumberInput
              min={10}
              max={99999}
              fontsize={36}
              height={80}
              step={1}
              value={4096}
              onChange={(val) => setFileSizeValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveNonces} />
            <CancelButton buttonLeft={45} onClick={handleCancelNonces} />
          </>
        ) : (
          <>
            <SelectedValue>{fileSizeValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelNonces} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

const SetupProving: React.FC = () => {
  const [cpuValue, setCpuValue] = useState(8); //placeholder
  const [noncesValue, setNoncesValue] = useState(288);
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);

  const cpu = require("../assets/cpu.png");

  const handleCancelCpu = () => {
    setCpuValue(8); // Reset to default value
    setIsCpuInputVisible(true);
  };

  const handleSaveCpu = () => {
    setIsCpuInputVisible(false);
  };

  const handleCancelNonces = () => {
    setNoncesValue(288); // Reset to default value
    setIsNoncesInputVisible(true);
  };

  const handleSaveNonces = () => {
    setIsNoncesInputVisible(false);
  };

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <TileWrapper>
        <Tile
          heading="Select number of CPU cores"
          footer="more CPU cores -> faster proof generation"
        />
        {isCpuInputVisible ? (
          <>
            <CustomNumberInput
              min={1}
              max={16}
              step={1}
              value={cpuValue}
              fontsize={36}
              height={80}
              onChange={(val) => setCpuValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveCpu} />
            <CancelButton buttonLeft={45} onClick={handleCancelCpu} />
          </>
        ) : (
          <>
            <SelectedValue>{cpuValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelCpu} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select number of Nonces"
          footer="more nonces -> more likely proof generated on the first try"
        />
        {isNoncesInputVisible ? (
          <>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={noncesValue}
              fontsize={36}
              height={80}
              onChange={(val) => setNoncesValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveNonces} />
            <CancelButton buttonLeft={45} onClick={handleCancelNonces} />
          </>
        ) : (
          <>
            <SelectedValue>{noncesValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelNonces} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

export { SetupSize, SetupProving };

import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../styles/colors";
import Tile from "../../components/tile";
import { CancelButton, SaveButton } from "../../components/button";
import CustomNumberInput from "../../components/input";

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.darkerGreen};
  z-index: 1000;
  width: 1200px;
  height: 740px;
`;

const Header = styled.h1`
  color: ${Colors.white};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 26px;
  margin-top: 40px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Subheader = styled.h2`
  color: ${Colors.greenLight};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 26px;
  padding: 0px 75px 10px;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: 20px;
  opacity: 0.02;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${Colors.purpleLight};
  cursor: pointer;
  font-size: 28px;
`;

const BottomContainer = styled.div`
  height: 400px;
  width: 1200px;
  position: absolute;
  top: 260px;
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

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const editSize = ({ onClose, isOpen }: Props) => {
  const [dataSizeValue, setPOSsizeValue] = useState(256);
  const [fileSizeValue, setFileSizeValue] = useState(4096);
  const [isPOSInputVisible, setIsPOSInputVisible] = useState(true);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);

  if (!isOpen) return null;
  const size = require("../../assets/duplicate.png");

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
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Set up POS size</Header>
        <Subheader>
          Don't set too much. This data will be read through every two weeks.
          <br />
          If your PC can't prepare POST proof in a few hours, you won't get any
          rewards.
        </Subheader>
        <BgImage src={size} />
        <BottomContainer>
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
      </Wrapper>
    </Backdrop>
  );
};

export default editSize;

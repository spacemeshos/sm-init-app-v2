import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../styles/colors";
import Tile from "../../components/tile";
import CustomNumberInput from "../../components/input";
import { SaveButton, CancelButton } from "../../components/button";

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
  margin-top: 80px;
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
  padding: 10px 75px 10px;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 30px;
  top: 30px;
  opacity: 0.03;
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

const CPUWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 112px;
  top: 260px;
`;

const NoncesWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 637px;
  top: 260px;
`;

const SelectedValue = styled.span`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro", sans-serif;
  font-size: 36px;
  height: 80px;
  display: flex;
  align-items: center;
  top: 50%;
  justify-content: center;
  z-index: 9999;
`;

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const CPUedit = ({ children, onClose, isOpen }: Props) => {
  const [cpuValue, setCpuValue] = useState(8);
  const [noncesValue, setNoncesValue] = useState(288);
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);

  if (!isOpen) return null;
  const cpu = require("../../assets/cpu.png");

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
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <BgImage src={cpu} />
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>How to prepare POST proofs </Header>
        <Subheader>
          Your CPU will be utilized once every two weeks to complete POET
          proving. Depending on your settings, it might take several hours.
        </Subheader>
        <CPUWrapper>
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
        </CPUWrapper>
        <NoncesWrapper>
          <Tile
            heading="Select number of Nonces"
            footer="more nonces -> more likely proof generated on the first try"
          />
          {isNoncesInputVisible ? (
            <>
              <CustomNumberInput
                min={16}
                max={999}
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
        </NoncesWrapper>
      </Wrapper>
    </Backdrop>
  );
};

export default CPUedit;

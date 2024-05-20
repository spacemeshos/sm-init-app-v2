import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import NumberInput from "./numberInput";

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
  opacity: 0.05;
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
  top: 300px;
`;

const NoncesWrapper = styled.div`
  height: 370px;
  width: 450px;
  position: absolute;
  left: 637px;
  top: 300px;
`;

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const CPUedit = ({ children, onClose, isOpen }: Props) => {
  if (!isOpen) return null;
  const cpu = require("../assets/cpu.png");

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <BgImage src={cpu} />
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>How to prepare POST proofs </Header>
        <Subheader>
          Please note that your CPU will be utilized once every two weeks to
          complete POET prooving. Depending on your settings, it might take
          several hours.
        </Subheader>
        <CPUWrapper>
          <Tile
            heading="Select number of CPU cores"
            footer="More CPU cores increase the proof generation speed"
          >
          <NumberInput aria-label="Quantity Input" />

          </Tile>
        </CPUWrapper>
        <NoncesWrapper>
          <Tile
            heading="Select number of Nonces"
            footer="More nonces increase the chance of generating proof on the first try"
          />
        </NoncesWrapper>
      </Wrapper>
    </Backdrop>
  );
};

export default CPUedit;

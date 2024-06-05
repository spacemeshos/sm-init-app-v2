import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../styles/colors";
import { SetupProving } from "../../components/setupPOS";

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
type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const CPUedit = ({ onClose, isOpen }: Props) => {

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>How to prepare POST proofs </Header>
        <Subheader>
          Your CPU will be utilized once every two weeks to complete POET
          proving. Depending on your settings, it might take several hours.
        </Subheader>
        <SetupProving/>
      </Wrapper>
    </Backdrop>
  );
};

export default CPUedit;

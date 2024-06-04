import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

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
  top: 5%;
  left: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.background};
  z-index: 1000;
  width: 1080px;
  height: 630px;
`;

const Header = styled.h1`
  color: ${Colors.greenLight};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 26px;
  margin-top: 40px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 5px;
  line-height: 20px;
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

const Text = styled.div`
  color: ${Colors.white};
  padding: 40px 75px;
  text-align: justify;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-size: 16px;
  font-weight: 100;
  line-height: 25px;
  white-space: pre-wrap;
  left: 200px;
  position: relative;
  width: 550px;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 300px;
  position: absolute;
  left: 20px;
  top: 200px;
  left: 50px;
  opacity: 0.2;
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

const Confirmation = ({ children, onClose, isOpen }: Props) => {
  if (!isOpen) return null;
  const rocket = require("../assets/rocket.png");

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Congratulations </Header>
        <Subheader>on launching your first proof of space</Subheader>
        <BgImage src={rocket} />
        <Text>
          {
            <>
              WHAT NOW?
              <br />
              <br />
              Leave your PC on and plugged into a power source 24/7.
              Your GPU will generate the POS data.
              <br />
              <br />
              After your PoS data is ready, set up a node to participate in
              the network and get rewards.
              <br />
              <br />
            </> //TODO more explanation to be added
          }
        </Text>
      </Wrapper>
    </Backdrop>
  );
};

export default Confirmation;

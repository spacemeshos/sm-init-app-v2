import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

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
  left: 450px;
  position: relative;
  width: 550px;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 600px;
  position: absolute;
  left: 30px;
  top: 80px;
  opacity: 0.02;
`;

const Confirmation: React.FC = () => {
  const rocket = require("../assets/rocket.png");

  return (
    <>
      <Header>Congratulations </Header>
      <Subheader>on launching your first proof of space</Subheader>
      <BgImage src={rocket} />
      <Text>
        {
          <>
            WHAT NOW?
            <br />
            <br />
            Leave your PC on and plugged into a power source 24/7. Your GPU will
            generate the POS data.
            <br />
            <br />
            After your PoS data is ready, set up a node to participate in the
            network and get rewards.
            <br />
            <br />
            [TO DO]
          </> //TODO more explanation to be added
        }
      </Text>
    </>
  );
};

export default Confirmation;

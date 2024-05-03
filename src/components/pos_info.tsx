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
  color: ${Colors.white};
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
  margin-top: 20px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 26px;
  padding: 20px 75px 10px;
`;

const Text = styled.div`
  color: ${Colors.white};
  padding: 20px 75px;
  margin-top: 10px;
  text-align: justify;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-size: 16px;
  font-weight: 100;
  line-height: 25px;
  white-space: pre-wrap;
`;

const BgImage = styled.img<{
  top: number;
  left: number;
}>`
  aspect-ratio: 1;
  object-fit: contain;
  width: 75px;
  position: absolute;
  left: 20px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  opacity: 0.2
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

const PosInfo = ({ children, onClose, isOpen}: Props) => {
  if (!isOpen) return null;
  const gpu = require("../assets/graphics-card.png");
  const files = require("../assets/duplicate.png");
  const cpu = require("../assets/cpu.png");

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Proof of space data Setup</Header>
        <Subheader>
          We run a benchmark to find the best settings for you, to maximise
          both: rewards and chances to qualify for them every epoch.
        </Subheader>
        <BgImage src={gpu}  top={225} left={35}/>
        <BgImage src={files}  top={340} left={35}/>
        <BgImage src={cpu}  top={460} left={35}/>
        <Text>
          {
            <>
              You'll create Proof of Space (PoS) data just once, then it has to
              be accessible for a regular check every two weeks. Hashing it is a
              long and laborious process. By default, your fastest GPU will do
              the job.
              <br />
              <br />
              The minimum you can allocate is 256 GiB, which equals 4 Space
              Units (1 SU = 64 GiB). Remember, we measure in Space Units, not
              single Gibibytes. If you want to allocate more, you must add it in
              whole Space Units, meaning another 64GiB each time The PoS data
              will be divided into several files, 4GiB each. You can change how
              big these files are if it makes things easier for you.
              <br />
              <br />
              Every 2 weeks, during 4-5 hours-long proving window, all the PoS
              data has to be read through sequentially. Your hardware and node
              have to finish the reading and preparing the Proof of Space-Time
              on time to qualify for the rewards in the next epoch. Keep it in
              mind while choosing the data size and CPU cores used to work on
              the proof generation.
            </>
          }
        </Text>
      </Wrapper>
    </Backdrop>
  );
};

export default PosInfo;

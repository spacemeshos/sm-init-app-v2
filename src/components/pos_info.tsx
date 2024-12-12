import React from "react";
import styled from "styled-components";

import cpu from "../assets/cpu.png";
import files from "../assets/duplicate.png";
import gpu from "../assets/graphics-card.png";
import Colors from "../styles/colors";
import { BodyText, Header, Subheader } from "../styles/texts";

import { CloseButton } from "./button";

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
  background-color: ${Colors.greenDark};
  z-index: 1000;
  width: 1080px;
  height: 630px;
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
  opacity: 0.2;
`;

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const PosInfo = ({ onClose, isOpen }: Props) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} top={2} left={97} />
        <Header text="Proof of space data Setup" />
        <Subheader
          text="We run a benchmark to find the best settings for you, to maximise
          both: rewards and chances to qualify for them every epoch."
        />
        <BgImage src={gpu} top={225} left={35} />
        <BgImage src={files} top={340} left={35} />
        <BgImage src={cpu} top={460} left={35} />
        <BodyText>
          {
            <>
              You&apos;ll create Proof of Space (PoS) data just once, then it
              has to be accessible for a regular check every two weeks. Hashing
              it is a long and laborious process. By default, your fastest GPU
              will do the job.
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
        </BodyText>
      </Wrapper>
    </Backdrop>
  );
};

export default PosInfo;

import * as React from "react";
import styled from "styled-components";
import { BackButton, IconButton } from "../../components/button";
import { Subheader, Title } from "../../components/texts";
import ProgressBar from "../../components/progress";
import Frame from "../../components/frames";
import Confirmation from "../../components/confirmation";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: absolute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 100px;
  top: 170px;
  position: absolute;
`;

const ContainerSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  left: 75px;
  top: 300px;
  width: 675px;
  height: 320px;
  position: absolute;
`;
const ContainerStart = styled.div`
  left: 800px;
  top: 300px;
  width: 300px;
  height: 300px;
  position: absolute;
`;

const Summary: React.FC = () => {
  const rocketbutton = require("../../assets/blastoff.png");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={100} />
        <BackButton />
      </NavProgress>
      <TextWrapper>
        <Title text="Summary of your Settings" />
        <Subheader text={"Check twice, adjust if needed, and blast off!"} />
      </TextWrapper>

      <ContainerSummary>
        <Frame
          height={25}
          heading=" POS DATA"
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POS Directory"
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POS Generation"
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POST Proving"
          subheader="placeholder summary"
        />
      </ContainerSummary>
      <ContainerStart>
        <IconButton
          iconSrc={rocketbutton}
          buttonTop={40}
          buttonLeft={45}
          size={150}
          modalComponent={Confirmation}
        />
      </ContainerStart>
    </>
  );
};

export default Summary;

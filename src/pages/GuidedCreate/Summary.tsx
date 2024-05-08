import * as React from "react";
import styled from "styled-components";
import { BackButton } from "../../components/button";
import Title from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import GreenFrame from "../../components/frames";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 100px;
  top: 170px;
  position: absolute;
`;

const ContainerBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  top: 290px;
  width: 1200px;
  position: absolute;
`;

const Summary: React.FC = () => {
  return (
    <>
      <NavProgress>
        <ProgressBar progress={100} />
        <BackButton />
      </NavProgress>
      <TextWrapper>
        <Title text="Summary of your Settings" />
      </TextWrapper>

      <ContainerBottom>
        <GreenFrame
          wrapperTop={0}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="DATA"
          subheader="placeholder summary"
        />
        <GreenFrame
          wrapperTop={80}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POS Directory"
          subheader="placeholder summary"
        />
        <GreenFrame
          wrapperTop={160}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POS Generation"
          subheader="placeholder summary"
        />
        <GreenFrame
          wrapperTop={240}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POST Proving"
          subheader="placeholder summary"
        />
      </ContainerBottom>
    </>
  );
};

export default Summary;

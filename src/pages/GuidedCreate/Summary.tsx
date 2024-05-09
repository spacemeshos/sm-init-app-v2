import * as React from "react";
import styled from "styled-components";
import { BackButton } from "../../components/button";
import { Subheader, Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Frame from "../../components/frames";

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
  const rocket = require("../../assets/rocket-circle.png");
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
        <Frame
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="DATA"
          subheader="placeholder summary"
        />
        <Frame
          wrapperTop={80}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POS Directory"
          subheader="placeholder summary"
        />
        <Frame
          wrapperTop={160}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POS Generation"
          subheader="placeholder summary"
        />
        <Frame
          wrapperTop={240}
          wrapperLeft={75}
          wrapperHeight={80}
          wrapperWidth={675}
          heading="POST Proving"
          subheader="placeholder summary"
        />
        <Frame
          wrapperHeight={320}
          wrapperWidth={300}
          wrapperLeft={810}
          borderColor={Colors.purpleLight}
        >
          <Title text={"blast off!"} />
          <Subheader text={"Check twice,"} top={30}/>
          <Subheader text={"adjust if needed,"} top={60}/>
          <Subheader text={"and"} top={90}/>
        </Frame>
      </ContainerBottom>
    </>
  );
};

export default Summary;

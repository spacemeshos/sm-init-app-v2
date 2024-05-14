import * as React from "react";
import styled from "styled-components";
import { BackButton, Button } from "../../components/button";
import { Subheader, Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Frame from "../../components/frames";
import Image from "../../components/image";

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
  const rocket = require("../../assets/rocket-lunch.png");
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

      <ContainerBottom>
        <Frame
          left={75}
          height={80}
          width={675}
          heading="DATA"
          subheader="placeholder summary"
        />
        <Frame
          top={80}
          left={75}
          height={80}
          width={675}
          heading="POS Directory"
          subheader="placeholder summary"
        />
        <Frame
          top={160}
          left={75}
          height={80}
          width={675}
          heading="POS Generation"
          subheader="placeholder summary"
        />
        <Frame
          top={240}
          left={75}
          height={80}
          width={675}
          heading="POST Proving"
          subheader="placeholder summary"
        />
        <Frame
          top={80}
          height={80}
          width={300}
          left={810}
          borderColor={Colors.purpleDark}
        >
          <Image
            src={rocket}
            opacity={0.1}
            height={520}
            left={-150}
            top={-210}
          />
          <Subheader text={"Ready?"} left={10} />
          <Button
            label={"start"}
            top={80}
            height={80}
            borderColor={Colors.purpleLight}
            backgroundColor={Colors.darkerPurple}
          />
        </Frame>
      </ContainerBottom>
    </>
  );
};

export default Summary;

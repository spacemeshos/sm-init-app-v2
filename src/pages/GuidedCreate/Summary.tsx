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
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const ContainerBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  top: 325px;
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
          wrapperHeight={92}
          wrapperWidth={675}
          heading="DATA"
        />
      </ContainerBottom>
    </>
  );
};

export default Summary;

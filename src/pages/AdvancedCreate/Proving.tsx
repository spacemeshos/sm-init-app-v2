import * as React from "react";
import styled from "styled-components";
import { BackButton, ForwardButton } from "../../components/button";
import { Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import { useNavigate } from "react-router-dom";
import { SetupProving } from "../../components/setupPOS";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 22px;
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
  flex: none;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  top: 278px;
  width: 1200px;
  height: 400px;
  position: absolute;
`;
const AdvSetupProving: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const AdvSetupProving = () => navigate("advanced/GPU");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={50} />
        <BackButton />
        <ForwardButton onClick={AdvSetupProving} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Set up POST proving" top={-20} />
        Whenever you feel lost, remember to read the tips,{" "}
      </TextWrapper>
      <ContainerBottom>
      <SetupProving/>

      </ContainerBottom>
    </>
  );
};

export default AdvSetupProving;

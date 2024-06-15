import * as React from "react";
import styled from "styled-components";
import { BackButton, ForwardButton } from "../../components/button";
import { Title } from "../../components/texts";
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
  height: 20px;
  top: 150px;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const AdvSetupProving: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const AdvSetupProving = () => navigate("/advanced/Provider");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={60} />
        <BackButton />
        <ForwardButton onClick={AdvSetupProving} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Set up POST proving" />
        Your CPU will be utilized once every two weeks to complete POET proving.
        <br/>
        Depending on your settings, it might take several hours.
      </TextWrapper>
      <SetupProving />
    </>
  );
};

export default AdvSetupProving;

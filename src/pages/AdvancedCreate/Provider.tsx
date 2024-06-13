import * as React from "react";
import styled from "styled-components";
import { BackButton, ForwardButton } from "../../components/button";
import { Title } from "../../components/titles";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import { useNavigate } from "react-router-dom";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 22px;
  top: 150px;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const AdvSetupProvider: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const SetupProving = () => navigate("/guided/Summary");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={80} />
        <BackButton />
        <ForwardButton onClick={SetupProving} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Select processor to generate POS" />
        The selected processor will be fully utilized until all POS data is
        generated. <br />
        During this time, it will not be available for other tasks.
      </TextWrapper>
    </>
  );
};

export default AdvSetupProvider;

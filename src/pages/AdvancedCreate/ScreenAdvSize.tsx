import * as React from "react";
import styled from "styled-components";
import { BackButton, ForwardButton } from "../../components/button";
import { Title } from "../../styles/texts";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import { useNavigate } from "react-router-dom";
import { SetupSize } from "../../components/setupPOS";

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

const ScreenAdvSize: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const SetupProvider = () => navigate("/advanced/Proving");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={40} />
        <BackButton />
        <ForwardButton onClick={SetupProvider} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Set up POS data size" />
        Keep in mind your hardware maximum capabilities
      </TextWrapper>
      <SetupSize />
    </>
  );
};

export default ScreenAdvSize;

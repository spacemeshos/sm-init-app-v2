import * as React from "react";
import styled from "styled-components";
import { BackButton } from "../../components/button";
import { Subheader, Title } from "../../components/texts";
import ProgressBar from "../../components/progress";
import { useNavigate } from "react-router-dom";
import { SetupSummary } from "../../components/setupPOS";

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

const ScreenSummary: React.FC = () => {
  // React Router's navigation hook
  // const navigate = useNavigate();
  // const Confirmation = () => navigate("/guided/Confirmation");

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

      <SetupSummary onStart={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </>
  );
};

export default ScreenSummary;

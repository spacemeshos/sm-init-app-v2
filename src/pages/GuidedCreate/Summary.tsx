import * as React from "react";
import styled from "styled-components";
import { BackButton, Button } from "../../components/button";
import { Subheader, Title } from "../../components/texts";
import ProgressBar from "../../components/progress";
import Frame from "../../components/frames";
import Colors from "../../styles/colors";
import { useNavigate } from "react-router-dom";
import rocket from "../../assets/rocket.png";

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
const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 550px;
  position: absolute;
  left: -180px;
  top: -120px;
  opacity: 0.02;
  z-index: 0;
`;

const Summary: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const Confirmation = () => navigate("/guided/Confirmation");

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
        <BgImage src={rocket} />
        <Button
          label="Start Data generation"
          borderColor={Colors.purpleLight}
          backgroundColor={Colors.darkerPurple}
          buttonTop={160}
          buttonLeft={25}
          height={80}
          onClick={Confirmation}
        />
      </ContainerStart>
    </>
  );
};

export default Summary;

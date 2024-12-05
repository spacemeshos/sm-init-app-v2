import * as React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/wave.png";
import { useState } from "react";
import Colors from "../styles/colors";
import {
  SelectDirectory,
  SetupGPU,
  SetupProving,
  SetupSize,
  SelectIdentity,
  SetupSummary,
  SelectATX,
} from "../components/setupPOS";
import { BackButton, TransparentButton } from "../components/button";
import { Title } from "../styles/texts";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const Image = styled.img`
  position: absolute;
  margin-bottom: 10px;
  right: 0px;
  top: 0px;
`;

const BottomContainer = styled.div`
  width: 960px;
  height: 480px;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translate(-50%);
  background-color: ${Colors.whiteOpaque};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  border-radius: 10px;
  justify-content: center;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /* Gradient border */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    padding: 1px;
    background: linear-gradient(
      45deg,
      ${Colors.whiteOpaque},
      ${Colors.greenLightOpaque}
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const SetupContainer = styled.div`
  width: 660px;
  height: 480px;
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 20px;
`;

const ButtonColumn = styled.div`
  position: absolute;
  width: 250px;
  height: 480px;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding-right: 10px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const ContentContainer = styled.div`
  width: 660px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
`;

const Generate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const steps = [
    {
      label: "Pick Directory",
      component: <SelectDirectory />,
    },
    {
      label: "Select Processor",
      component: <SetupGPU isOpen={true} />,
    },
    {
      label: "Set up Proving",
      component: <SetupProving />,
    },
    {
      label: "Set up POS Size",
      component: <SetupSize />,
    },
    {
      label: "Select Identity",
      component: <SelectIdentity />,
    },
    {
      label: "Select ATX ID",
      component: <SelectATX />,
    },
  ];

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setShowSummary(false);
  };

  const handleStartGeneration = () => {
    console.log("Starting POS data generation...");
  };

  const renderContent = () => {
    if (showSummary) {
      return <SetupSummary onStart={handleStartGeneration} />;
    }
    return steps[currentStep].component;
  };

  return (
    <>
      <NavProgress>
        <BackButton />
      </NavProgress>
      <Image src={BackgroundImage} />
      <BottomContainer>
        <SetupContainer>
          <TextWrapper>
            <Title
              text={
                showSummary
                  ? "Summary of your Settings"
                  : steps[currentStep].label
              }
            />
          </TextWrapper>

          <ContentContainer>{renderContent()}</ContentContainer>
        </SetupContainer>
        <ButtonColumn>
          {steps.map((step, index) => (
            <TransparentButton
              key={index}
              onClick={() => handleStepChange(index)}
              $isActive={currentStep === index}
              label={step.label}
              width={250}
            ></TransparentButton>
          ))}
          <TransparentButton
            onClick={() => setShowSummary(true)}
            $isActive={showSummary}
            width={250}
            label="Summary"
          ></TransparentButton>
        </ButtonColumn>
      </BottomContainer>
    </>
  );
};

export default Generate;

import * as React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/lines.png";
import { useState } from "react";
import Colors from "../styles/colors";
import { Subheader, Title } from "../styles/texts";
import {
  SelectDirectory,
  SetupGPU,
  SetupProving,
  SetupSize,
  SelectIdentity,
  SetupSummary
} from "../components/setupPOS";

const Image = styled.img`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  object-fit: cover;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const SetupContainer = styled.div`
  width: 960px;
  height: 480px;
  position: relative;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  background-color: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
`;

const MenuContainer = styled.div`
  position: absolute;
  width: 250px;
  height: 480px;
  right: 0px;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.02);
`;

const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  justify-content: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
`;

const StyledButton = styled.button<{ $isActive?: boolean }>`
  width: 200px;
  height: 60px;
  font-size: 16px;
  cursor: pointer;
  border: 0.5px solid ${props => props.$isActive ? Colors.greenLight : 'rgba(255, 255, 255, 0.05)'};
  background-color: ${props => props.$isActive ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  transition: all 0.2s ease;
  font-family: "Source Code Pro Extralight", sans-serif;
  color: ${Colors.white};
  font-size: 14px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ContentContainer = styled.div`
  width: calc(100% - 250px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
      <Image src={BackgroundImage} />
      <BottomContainer>
        <SetupContainer>
          <TextWrapper>
            <Title text={showSummary ? "Summary of your Settings" : steps[currentStep].label} />
            {showSummary && (
              <Subheader text="Check twice, adjust if needed, and blast off!" />
            )}
          </TextWrapper>

          <ContentContainer>
            {renderContent()}
          </ContentContainer>

          <MenuContainer>
            <ButtonColumn>
              {steps.map((step, index) => (
                <StyledButton
                  key={index}
                  onClick={() => handleStepChange(index)}
                  $isActive={currentStep === index}
                >
                  {step.label}
                </StyledButton>
              ))}
              <StyledButton
                onClick={() => setShowSummary(true)}
                $isActive={showSummary}
              >
                Summary
              </StyledButton>
            </ButtonColumn>
          </MenuContainer>
        </SetupContainer>
      </BottomContainer>
    </>
  );
};

export default Generate;

import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

import BackgroundImage from "../assets/wave.png";
import { BackButton, TransparentButton } from "../components/button";
import {
  SelectDirectory,
  SetupGPU,
  SetupProving,
  SetupSize,
  SelectIdentity,
  SelectATX,
  POSSummary,
} from "../components/pos/index";
import { useConsole } from "../state/ConsoleContext";
import { useSettings } from "../state/SettingsContext";
import Colors from "../styles/colors";
import { Header } from "../styles/texts";

const Background = styled.img`
  position: fixed;
  width: 100%;
  object-fit: cover;
`;

const MainContainer = styled.div`
  width: 1000px;
  height: 800px;
  position: fixed;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${Colors.darkOpaque};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
      ${Colors.greenLightOpaque},
      ${Colors.whiteOpaque}
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
  width: 800px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 10%;
  display: flex;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const ButtonColumn = styled.div`
  position: absolute;
  width: 200px;
  height: 650px;
  top: 10%;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const ErrorMessage = styled.div`
  color: ${Colors.red};
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Generate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updateConsole } = useConsole();
  const { settings } = useSettings();

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
    setError(null);
  };

  const handleProceed = () => {
    setIsGenerating(true);
    updateConsole("generation", "POS data generation started in background...");
    updateConsole(
      "settings",
      `Using settings: ${JSON.stringify(settings, null, 2)}`
    );
  };

  const renderContent = () => {
    if (showSummary) {
      return (
        <POSSummary
          onProceed={handleProceed}
          isGenerating={isGenerating}
          error={error}
          updateConsole={updateConsole}
        />
      );
    }
    return steps[currentStep].component;
  };

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton />
      <MainContainer>
        <TextWrapper>
          <Header
            text={
              showSummary
                ? "SUMMARY OF YOUR SETTINGS"
                : steps[currentStep].label
            }
          />
        </TextWrapper>
        <SetupContainer>
          <SetupContainer>{renderContent()}</SetupContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SetupContainer>
        <ButtonColumn>
          <TransparentButton
            onClick={() => {
              setShowSummary(true);
            }}
            $isActive={showSummary}
            width={200}
            label="Summary"
            disabled={isGenerating}
          />

          {steps.map((step, index) => (
            <TransparentButton
              key={index}
              onClick={() => handleStepChange(index)}
              $isActive={currentStep === index}
              label={step.label}
              width={200}
              disabled={isGenerating}
            ></TransparentButton>
          ))}
        </ButtonColumn>
      </MainContainer>
    </>
  );
};

export default Generate;

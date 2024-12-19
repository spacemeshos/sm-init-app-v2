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
import {
  Background,
  MainContainer,
  PageTitleWrapper,
} from "../styles/containers";

const SetupContainer = styled.div`
  width: 800px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 40px;
  display: flex;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const ButtonColumn = styled.div`
  position: absolute;
  width: 200px;
  height: 600px;
  top: 120px;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
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
        <PageTitleWrapper>
          <Header
            text={
              showSummary
                ? "SUMMARY OF YOUR SETTINGS"
                : steps[currentStep].label
            }
          />
        </PageTitleWrapper>
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

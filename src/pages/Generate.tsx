import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

import BackgroundImage from "../assets/wave2.png";
import { BackButton, DotButton } from "../components/button";
import {
  SelectDirectory,
  SetupGPU,
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
import file from "../assets/file.png";
import folder from "../assets/folder.png";
import gpu from "../assets/gpu.png";
import id from "../assets/id.png";
import summary from "../assets/justify.png";
import hex from "../assets/formats.png";

const SetupContainer = styled.div`
  width: 800px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 160px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  padding: 20px;
`;

const ButtonColumn = styled.div`
  position: absolute;
  width: 80px;
  height: 420px;
  top: 180px;
  left: 170px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  const [showSummary, setShowSummary] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updateConsole } = useConsole();
  const { settings } = useSettings();

  const steps = [
    {
      label: "Pick Directory",
      component: <SelectDirectory />,
      iconSrc: folder,
    },
    {
      label: "Select Processor",
      component: <SetupGPU isOpen={true} />,
      iconSrc: gpu,
    },
    {
      label: "Set up POS Size",
      component: <SetupSize />,
      iconSrc: file,
    },
    {
      label: "Select Identity",
      component: <SelectIdentity />,
      iconSrc: id,
    },
    {
      label: "Select ATX ID",
      component: <SelectATX />,
      iconSrc: hex,
    },
  ];

  const handleStepChange = (index: number) => {
    // If index is out of steps range, show summary
    if (index >= 5) {
      setShowSummary(true);
    } else {
      setShowSummary(false);
      setCurrentStep(index);
    }
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
          onStepChange={handleStepChange}
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
                ? "YOUR POS GENERATION SETTINGS"
                : steps[currentStep].label
            }
          />
        </PageTitleWrapper>
        <SetupContainer>{renderContent()}</SetupContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </MainContainer>
      <ButtonColumn>
        <DotButton
          onClick={() => handleStepChange(steps.length)}
          $isActive={showSummary}
          iconSrc={summary}
        />

        {steps.map((step, index) => (
          <DotButton
            key={index}
            onClick={() => handleStepChange(index)}
            $isActive={currentStep === index}
            disabled={isGenerating}
            iconSrc={step.iconSrc}
            alt={step.label}
          />
        ))}
      </ButtonColumn>
    </>
  );
};

export default Generate;

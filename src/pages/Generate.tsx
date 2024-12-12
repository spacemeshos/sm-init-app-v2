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
import { executePostCli } from "../services/postcliService";
import { useConsole } from "../state/ConsoleContext";
import { useSettings } from "../state/SettingsContext";
import Colors from "../styles/colors";
import { Header } from "../styles/texts";

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

const ErrorMessage = styled.div`
  color: ${Colors.red};
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      updateConsole("generation", "Starting POS data generation...");
      updateConsole(
        "settings",
        `Using settings: ${JSON.stringify(settings, null, 2)}`
      );

      const result = await executePostCli(settings, updateConsole);

      updateConsole(
        "result",
        `Generation result: ${JSON.stringify(result, null, 2)}`
      );

      if (!result.success) {
        const errorMsg = result.stderr || "Failed to generate POS data";
        setError(errorMsg);
        updateConsole("error", errorMsg);
      } else if (result.stdout) {
        updateConsole("success", result.stdout);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      updateConsole("error", `Generation error: ${errorMessage}`);
    }

    setIsGenerating(false);
  };

  const renderContent = () => {
    if (showSummary) {
      return <POSSummary onProceed={handleStartGeneration} />;
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
            <Header
              text={
                showSummary
                  ? "Summary of your Settings"
                  : steps[currentStep].label
              }
            />
          </TextWrapper>

          <ContentContainer>{renderContent()}</ContentContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SetupContainer>
        <ButtonColumn>
          {steps.map((step, index) => (
            <TransparentButton
              key={index}
              onClick={() => handleStepChange(index)}
              $isActive={currentStep === index}
              label={step.label}
              width={250}
              disabled={isGenerating}
            ></TransparentButton>
          ))}
          <TransparentButton
            onClick={() => {
              setShowSummary(true);
            }}
            $isActive={showSummary}
            width={250}
            label="Summary"
            disabled={isGenerating}
          ></TransparentButton>
        </ButtonColumn>
      </BottomContainer>
    </>
  );
};

export default Generate;

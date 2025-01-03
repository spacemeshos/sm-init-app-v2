import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import BackgroundImage from '../assets/wave2.png';
import { BackButton, DotButton } from '../components/button';
import {
  SelectDirectory,
  SetupGPU,
  SetupSize,
  SelectIdentity,
  SelectATX,
  POSSummary,
} from '../components/pos/index';
import { useConsole } from '../state/ConsoleContext';
import { useSettings } from '../state/SettingsContext';
import Colors from '../styles/colors';
import { Header } from '../styles/texts';
import {
  Background,
  MainContainer,
  PageTitleWrapper,
} from '../styles/containers';
import file from '../assets/file.png';
import folder from '../assets/folder.png';
import gpu from '../assets/gpu.png';
import id from '../assets/id.png';
import summary from '../assets/justify.png';
import hex from '../assets/formats.png';
import gear from '../assets/setting.png';
import copy from '../assets/copy.png';
import box from '../assets/box.png';

const Wrapper = styled.div`
  width: 880px;
  height: 750px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
`;

const SetupContainer = styled.div`
  width: 800px;
  height: 420px;
  position: absolute;
  left: 0px;
  top: 180px;
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
  height: 350px;
  top: 180px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const AdvancedSettingsButton = styled.button`
  background: transparent;
  border: 1px solid ${Colors.white};
  color: ${Colors.white};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  right: 100px;
  top: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  img {
    width: 16px;
    height: 16px;
  }
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
  const [currentStep, setCurrentStep] = useState<number>(7);
  const [showSummary, setShowSummary] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] =
    useState<boolean>(false);
  const { updateConsole } = useConsole();
  const { settings } = useSettings();

  const steps = [
    {
      label: 'Pick Directory',
      component: <SelectDirectory />,
      iconSrc: folder,
    },
    {
      label: 'Select Processor',
      component: <SetupGPU isOpen={true} />,
      iconSrc: gpu,
    },
    {
      label: 'Set up POS Size',
      component: <SetupSize />,
      iconSrc: box,
    },
    {
      label: 'Select Identity',
      component: <SelectIdentity />,
      iconSrc: id,
    },
    {
      label: 'Setup Max File Size',
      component: <SetupSize />,
      iconSrc: file,
    },
    {
      label: 'Select ATX ID',
      component: <SelectATX />,
      iconSrc: hex,
    },
    {
      label: 'Split Generation in Subsets',
      iconSrc: copy,
    },
  ];

  const handleStepChange = (index: number) => {
    // If index is out of steps range, show summary
    if (index >= 7) {
      setShowSummary(true);
      setCurrentStep(7); // Set currentStep to steps.length when showing summary
    } else {
      setShowSummary(false);
      setCurrentStep(index);
    }
    setError(null);
  };

  const handleProceed = () => {
    setIsGenerating(true);
    updateConsole('generation', 'POS data generation started in background...');
    updateConsole(
      'settings',
      `Using settings: ${JSON.stringify(settings, null, 2)}`
    );
  };

  const renderContent = () => {
    if (!showSummary) {
      return steps[currentStep].component;
    }

    if (showAdvancedSettings) {
      return (
        <POSSummary
          onProceed={handleProceed}
          isGenerating={isGenerating}
          error={error}
          updateConsole={updateConsole}
          onStepChange={(step) => {
            setShowSummary(false);
            handleStepChange(step);
          }}
          initialAdvancedVisible={true}
          showOnlyAdvanced={true}
        />
      );
    }

    return (
      <POSSummary
        onProceed={handleProceed}
        isGenerating={isGenerating}
        error={error}
        updateConsole={updateConsole}
        onStepChange={handleStepChange}
      />
    );
  };

  const toggleAdvancedSettings = () => {
    if (showAdvancedSettings) {
      setShowAdvancedSettings(false);
      setShowSummary(true);
      setCurrentStep(7);
    } else {
      setShowAdvancedSettings(true);
      setShowSummary(true);
      setCurrentStep(7); // Keep in summary view when entering advanced mode
    }
  };

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton />
      <Wrapper>
        <MainContainer>
          <PageTitleWrapper>
            <Header
              text={
                showAdvancedSettings
                  ? 'ADVANCED SETTINGS'
                  : showSummary
                    ? 'YOUR POS GENERATION SETTINGS'
                    : steps[currentStep].label
              }
            />
          </PageTitleWrapper>
          <AdvancedSettingsButton onClick={toggleAdvancedSettings}>
            <img src={gear} alt="Advanced Settings" />
            {showAdvancedSettings ? 'Back to Main' : 'Advanced Settings'}
          </AdvancedSettingsButton>
          <SetupContainer>{renderContent()}</SetupContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </MainContainer>
        <ButtonColumn>
          <DotButton
            onClick={() => handleStepChange(steps.length)}
            $isActive={showSummary && currentStep === 7}
            iconSrc={summary}
          />
          {!showAdvancedSettings
            ? steps
                .slice(0, 3)
                .map((step, index) => (
                  <DotButton
                key={index}
                onClick={() => handleStepChange(index)}
                $isActive={currentStep === index}
                disabled={isGenerating}
                iconSrc={step.iconSrc}
                alt={step.label}
                  />
                ))
            : steps
                .slice(3, 7)
                .map((step, index) => (
                  <DotButton
                key={index + 3}
                onClick={() => handleStepChange(index + 3)}
                $isActive={currentStep === index + 3}
                disabled={isGenerating}
                iconSrc={step.iconSrc}
                alt={step.label}
                  />
                ))}
        </ButtonColumn>
      </Wrapper>
    </>
  );
};

export default Generate;

import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

import box from '../assets/box.png';
import copy from '../assets/copy.png';
import file from '../assets/filesize.png';
import folder from '../assets/folder.png';
import hex from '../assets/formats.png';
import gpu from '../assets/gpu.png';
import id from '../assets/id.png';
import summary from '../assets/justify.png';
import gear from '../assets/setting.png';
import BackgroundImage from '../assets/wave2.png';
import { BackButton } from '../components/button';
import {
  SelectDirectory,
  SetupGPU,
  SetupFileSize,
  SetupDataSize,
  SelectIdentity,
  SelectATX,
  POSSummary,
} from '../components/pos/index';
import VerticalTabs, { TabItem } from '../components/VerticalTabs';
import { useConsole } from '../state/ConsoleContext';
import { useSettings } from '../state/SettingsContext';
import Colors from '../styles/colors';
import {
  Background,
  MainContainer,
  PageTitleWrapper,
} from '../styles/containers';
import { Header } from '../styles/texts';
import { FindProviders } from '../utils/parseResponse';

const Wrapper = styled.div`
  width: 1080px;
  height: 750px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const TabsContainer = styled.div`
  width: 1000px;
  height: 500px;
  position: relative;
  top: 180px;
`;

const AdvancedSettingsButton = styled.button`
  background: ${Colors.greenLightOpaque};
  border: 1px solid ${Colors.greenLightOpaque};
  color: ${Colors.white};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  right: 50px;
  top: 140px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 18px;
  transition: background 0.2s;

  &:hover {
    background: ${Colors.whiteOpaque};
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
  const [activeTabId, setActiveTabId] = useState<string>('summary');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] =
    useState<boolean>(false);
  const { updateConsole } = useConsole();
  const { settings, setSettings } = useSettings();
  const { run, response } = FindProviders();

  // Detect providers on component mount
  useEffect(() => {
    const detectProviders = async () => {
      await run(['-printProviders'], updateConsole);
    };
    detectProviders();
  }, [run, updateConsole]);

  // Set initial provider when providers are detected
  useEffect(() => {
    if (response && response.length > 0) {
      setSettings((prev) => ({
        ...prev,
        provider: 0,
        providerModel: response[0].Model,
      }));
    }
  }, [response, setSettings]);

  // Define tabs based on whether we're showing basic or advanced settings
  const getTabs = (): TabItem[] => {
    const basicTabs: TabItem[] = [
      {
        id: 'summary',
        label: 'Summary',
        iconSrc: summary,
        content: (
          <POSSummary
            onProceed={handleProceed}
            isGenerating={isGenerating}
            error={error}
            updateConsole={updateConsole}
            onStepChange={(step) => {
              const tabId = getTabIdFromStepIndex(step);
              if (tabId) setActiveTabId(tabId);
            }}
          />
        ),
      },
      {
        id: 'directory',
        label: 'Pick Directory',
        iconSrc: folder,
        content: <SelectDirectory variant="full" showExplanation={true} />,
      },
      {
        id: 'processor',
        label: 'Select Processor',
        iconSrc: gpu,
        content: <SetupGPU isOpen={true} initialProviders={response} />,
      },
      {
        id: 'size',
        label: 'Set up POS Size',
        iconSrc: box,
        content: <SetupDataSize />,
      },
    ];

    const advancedTabs: TabItem[] = [
      {
        id: 'summary',
        label: 'Summary',
        iconSrc: summary,
        content: (
          <POSSummary
            onProceed={handleProceed}
            isGenerating={isGenerating}
            error={error}
            updateConsole={updateConsole}
            onStepChange={(step) => {
              const tabId = getTabIdFromStepIndex(step);
              if (tabId) setActiveTabId(tabId);
            }}
            initialAdvancedVisible={true}
            showOnlyAdvanced={true}
          />
        ),
      },
      {
        id: 'identity',
        label: 'Select Identity',
        iconSrc: id,
        content: <SelectIdentity />,
      },
      {
        id: 'filesize',
        label: 'Setup Max File Size',
        iconSrc: file,
        content: <SetupFileSize />,
      },
      {
        id: 'atx',
        label: 'Select ATX ID',
        iconSrc: hex,
        content: <SelectATX />,
      },
      {
        id: 'subsets',
        label: 'Split Generation',
        iconSrc: copy,
        content: <div>To Be Implemented</div>,
      }
    ];

    return showAdvancedSettings ? advancedTabs : basicTabs;
  };

  // Helper function to convert step index to tab ID
  const getTabIdFromStepIndex = (index: number): string | null => {
    if (index >= 7) return 'summary';

    const tabIds = showAdvancedSettings
      ? ['identity', 'filesize', 'atx', 'subsets']
      : ['directory', 'processor', 'size'];

    return index < tabIds.length ? tabIds[index] : null;
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
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

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
    setActiveTabId('summary'); // Reset to summary view when toggling
  };

  // Get the current active tab's label for the page title
  const getPageTitle = () => {
    if (showAdvancedSettings) {
      return 'ADVANCED SETTINGS';
    }

    const activeTab = getTabs().find((tab) => tab.id === activeTabId);
    return activeTab?.id === 'summary'
      ? 'YOUR POS GENERATION SETTINGS'
      : activeTab?.label.toUpperCase();
  };

  return (
    <>
      <Background src={BackgroundImage} />
      <BackButton />
      <Wrapper>
        <MainContainer>
          <PageTitleWrapper>
            <Header text={getPageTitle()} />
          </PageTitleWrapper>
          <AdvancedSettingsButton onClick={toggleAdvancedSettings}>
            <img src={gear} alt="Advanced Settings" />
            {showAdvancedSettings ? 'Back to Main' : 'Advanced Settings'}
          </AdvancedSettingsButton>
          <TabsContainer>
            <VerticalTabs
              tabs={getTabs()}
              activeTab={activeTabId}
              onTabChange={handleTabChange}
              width={1000}
              height={500}
            />
          </TabsContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </MainContainer>
      </Wrapper>
    </>
  );
};

export default Generate;

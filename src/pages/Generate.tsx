import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from '../components/button';
import Modal from '../components/modal';
import {
  SelectDirectory,
  SetupGPU,
  SetupFileSize,
  SetupDataSize,
  SelectIdentity,
  SelectATX,
} from '../components/pos/index';
import VerticalTabs, { TabItem } from '../components/VerticalTabs';
import { fetchLatestAtxId } from '../services/postcliService';
import { executePostCliDetached } from '../services/postcliService';
import { useConsole } from '../state/ConsoleContext';
import { usePOSProcess } from '../state/POSProcessContext';
import { useSettings } from '../state/SettingsContext';
import Colors from '../styles/colors';
import {
  Background,
  MainContainer,
  PageTitleWrapper,
} from '../styles/containers';
import { ErrorMessage, Header } from '../styles/texts';
import { List } from '../styles/texts';
import { getDirectoryDisplay } from '../utils/directoryUtils';
import { truncateHex } from '../utils/hexUtils';
import { isValidHex } from '../utils/hexUtils';
import { FindProviders } from '../utils/parseResponse';
import { calculateNumFiles, calculateTotalSize } from '../utils/sizeUtils';

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

/**
 * Generate Component
 *
 * Features:
 * - Configuration overview
 * - Settings validation
 * - Generation initiation
 * - Progress tracking
 * - Navigation handling
 *
 * The component manages:
 * 1. Settings Display:
 *    - Directory configuration
 *    - Provider selection
 *    - Space allocation
 *    - Advanced settings
 *
 * 2. Validation:
 *    - Required parameters
 *    - Format validation
 *    - ATX ID verification
 *
 * 3. Generation:
 *    - Process initiation
 *    - Progress tracking
 *    - Error handling
 */
const Generate: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('summary');
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] =
    useState<boolean>(false);
  const { updateConsole } = useConsole();
  const { settings, setSettings } = useSettings();
  const { run, response } = FindProviders();
  const navigate = useNavigate();
  const { startProcess, processState } = usePOSProcess();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isGenerating = processState.isRunning || false;

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

  /**
   * Validates all required settings before generation
   * Checks:
   * - Provider selection
   * - Unit allocation
   * - Identity format
   *
   * @returns {string[]} Array of validation error messages
   */
  const validateSettings = (): string[] => {
    const errors: string[] = [];

    // Check provider
    if (settings.provider === undefined) {
      errors.push('Provider must be selected');
    }

    // Check number of units
    if (!settings.numUnits || settings.numUnits < 4) {
      errors.push('Number of units must be at least 4');
    }

    // Check identity key format if provided
    if (settings.publicKey && !isValidHex(settings.publicKey)) {
      errors.push('Invalid identity key format');
    }

    return errors;
  };

  /**
   * Handles POS generation initiation
   * Process:
   * 1. Validates settings
   * 2. Fetches ATX ID if needed
   * 3. Starts generation process
   * 4. Handles success/failure
   */
  const handleGenerateClick = async () => {
    // First check non-ATX validation
    const errors = validateSettings();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    try {
      let currentSettings = settings;

      // If ATX ID is missing or invalid, try to fetch it
      if (!currentSettings.atxId || !isValidHex(currentSettings.atxId)) {
        updateConsole(
          'generate',
          'Fetching ATX ID before starting generation...'
        );
        try {
          const atxResponse = await fetchLatestAtxId();
          // Create new settings object with fetched ATX ID
          currentSettings = {
            ...currentSettings,
            atxId: atxResponse.atxId,
            atxIdSource: 'api',
            atxIdError: undefined,
          };
          // Update the global settings state
          setSettings(currentSettings);
        } catch (err) {
          errors.push(
            `Failed to fetch ATX ID. Please try again or enter manually. ${err}`
          );
          setValidationErrors(errors);
          setShowValidationModal(true);
          return;
        }
      }

      // If we have any other validation errors, show them
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationModal(true);
        return;
      }

      updateConsole('generate', 'Starting POS data generation...');

      // Now we can proceed with POS generation using the current settings
      const response = await executePostCliDetached(
        currentSettings,
        updateConsole
      );

      if (response && response.process_id) {
        updateConsole(
          'generate',
          `POS generation started with process ID: ${response.process_id}`
        );
        startProcess(response.process_id);
        setShowSuccessModal(true);

        /**
         * Navigate to progress page after showing success modal
         * Use a short delay to ensure the modal is visible
         * This should be replaced with switch to progress page underneath while modal is open,
         * close modal only with user action
         */
        setTimeout(() => {
          navigate('/progress');
        }, 1500);
      } else {
        throw new Error('Failed to start POS generation process');
      }
    } catch (error) {
      console.error('Error starting POS generation:', error);
      updateConsole(
        'generate',
        `Error starting POS generation: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  // Define tabs based on whether we're showing basic or advanced settings
  const getTabs = (): TabItem[] => {
    const basicTabs: TabItem[] = [
      {
        id: 'summary',
        label: 'Summary',
        iconSrc: summary,
      },
      {
        id: 'directory',
        label: 'Pick Directory',
        description: getDirectoryDisplay(
          settings.selectedDir,
          settings.defaultDir
        ),
        iconSrc: folder,
        content: <SelectDirectory variant="full" showExplanation={true} />,
      },
      {
        id: 'processor',
        label: 'Select Processor',
        description: settings.providerModel
          ? settings.providerModel
          : 'Not selected',
        iconSrc: gpu,
        content: <SetupGPU isOpen={true} initialProviders={response} />,
      },
      {
        id: 'size',
        label: 'Set up POS Size',
        description: `${settings.numUnits || 4} Space Units | ${calculateTotalSize(settings.numUnits)}`,
        iconSrc: box,
        content: <SetupDataSize />,
      },
    ];

    const advancedTabs: TabItem[] = [
      {
        id: 'summary',
        label: 'Summary',
        iconSrc: summary,
      },
      {
        id: 'identity',
        label: 'Select Identity',
        description: settings.publicKey
          ? `Key: ${truncateHex(settings.publicKey, 8)}`
          : 'Create New Identity',
        iconSrc: id,
        content: <SelectIdentity />,
      },
      {
        id: 'filesize',
        label: 'Setup Max File Size',
        description: `${calculateNumFiles(settings.numUnits, settings.maxFileSize || 4096)} files, ${settings.maxFileSize} MiB each`,
        iconSrc: file,
        content: <SetupFileSize />,
      },
      {
        id: 'atx',
        label: 'Select ATX ID',
        description: settings.atxId
          ? `ATX: ${truncateHex(settings.atxId, 8)}`
          : 'Default',
        iconSrc: hex,
        content: <SelectATX />,
      },
      {
        id: 'subsets',
        label: 'Split Generation',
        description: 'To Be Implemented',
        iconSrc: copy,
        content: <div>To Be Implemented</div>,
      },
    ];

    return showAdvancedSettings ? advancedTabs : basicTabs;
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setError(null);
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
        {/* Validation Error Modal */}
        <Modal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          width={600}
          height={50}
          header="Missing Required Parameters"
          text={
            <>
              Please configure the following required parameters:
              <List
                items={validationErrors}
                bulletColor={Colors.red}
                itemColor={Colors.white}
                width="80%"
                maxWidth="400px"
              />
            </>
          }
        />

        {/* Success Modal with Instructions */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/progress');
          }}
          header="POS Generation Started"
          width={600}
          height={80}
          text={
            <>
              WHAT NOW?
              <br />
              <br />
              Leave your PC on and plugged into a power source 24/7.
              <br />
              Your GPU will operate at its full capacity to generate the Proof
              of Space (PoS) data.
              <br />
              <br />
              The duration of this process depends on your hardware and setup,
              ranging from several days to a few weeks. While it may require
              significant effort initially, this is a one-time task.
              <br />
              <br />
              Once your PoS data is successfully generated, you'll be ready to
              set up a node and actively participate in the network to start
              earning rewards.
            </>
          }
        />

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
            <Button
              label={isGenerating ? 'Starting...' : 'Generate POS Data'}
              onClick={handleGenerateClick}
              width={250}
              height={56}
              disabled={isGenerating}
            />
          </TabsContainer>

          {error && <ErrorMessage text={error} />}
        </MainContainer>
      </Wrapper>
    </>
  );
};

export default Generate;

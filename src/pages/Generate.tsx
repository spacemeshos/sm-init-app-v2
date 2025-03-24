import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import box from '../assets/box.png';
import file from '../assets/filesize.png';
import folder from '../assets/folder.png';
import hex from '../assets/formats.png';
import gpu from '../assets/gpu.png';
import id from '../assets/id.png';
import summary from '../assets/justify.png';
import BackgroundImage from '../assets/wave2.png';
import { BackButton } from '../components/button';
import { Button } from '../components/button';
import { MetafileModal } from '../components/MetafileModal';
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

const TabsContainer = styled.div`
  width: 100%;
  position: relative;
  top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  const [isTabsCollapsed, setIsTabsCollapsed] = useState<boolean>(false);
  const { updateConsole } = useConsole();
  const { settings, setSettings, fetchAtxId } = useSettings();
  const { run, response } = FindProviders();
  const navigate = useNavigate();
  const { startProcess, processState } = usePOSProcess();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const isFetchedOnce = React.useRef(false);

  const isGenerating = processState.isRunning || false;

  useEffect(() => {
    if (
      !isFetchedOnce.current &&
      !settings.atxIdFetching &&
      settings.atxIdSource === 'api' &&
      settings.atxId === undefined
    ) {
      fetchAtxId();
      isFetchedOnce.current = true;
    }
  }, [settings]);

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

    if (settings.atxIdError) {
      errors.push(settings.atxIdError);
    } else if (!settings.atxId) {
      errors.push('ATX ID is missing or invalid');
    } else if (!isValidHex(settings.atxId)) {
      errors.push('Invalid ATX ID format');
    }

    return errors;
  };

  const isValid = validateSettings().length === 0;

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
      console.log('Generate: Using existing ATX ID:', {
        atxId: settings.atxId,
        source: settings.atxIdSource
      });

      // If we have any other validation errors, show them
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationModal(true);
        return;
      }

      updateConsole('generate', 'Starting POS data generation...');

      // Now we can proceed with POS generation using the current settings
      const response = await executePostCliDetached(
        settings,
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
        }, 150000);
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
  const tabs: TabItem[] = [
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
    {
      id: 'filesize',
      label: 'Setup Max File Size',
      description: `${calculateNumFiles(settings.numUnits, settings.maxFileSize || 4096)} files, ${settings.maxFileSize} MiB each`,
      iconSrc: file,
      content: <SetupFileSize />,
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
      id: 'atx',
      label: 'Select ATX ID',
      description: settings.atxId
        ? truncateHex(settings.atxId, 8)
        : settings.atxIdFetching
        ? 'Fetching...'
        : 'Please provide ATX ID manually',
      error: settings.atxIdError,
      iconSrc: hex,
      content: <SelectATX />,
    },
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setError(null);
  };

  //
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);
  const activeTab = tabs[activeTabIndex];
  const nextTab = tabs[activeTabIndex + 1];

  // Get the current active tab's label for the page title
  const pageTitle = activeTab?.id === 'summary'
    ? 'YOUR POS GENERATION SETTINGS'
    : activeTab?.label.toUpperCase();

  const GenerateButton = () => (
    <Button
      label={isGenerating ? 'Starting...' : 'Generate POS Data'}
      onClick={handleGenerateClick}
      width={250}
      height={56}
      disabled={isGenerating || !isValid}
      margin={20}
    />
  );

  const NextButton = () =>
    isGenerating || !nextTab
      ? <GenerateButton />
      : <Button
          label="Next"
          onClick={() => handleTabChange(nextTab.id)}
          width={250}
          height={56}
          margin={20}
        />;

  return (
    <>
      <Background src={BackgroundImage} />
      {/* Validation Error Modal */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        width={600}
        height={300}
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
        width={700}
        height={450}
        text={
          <>
            What Now?
            <br />
            <br />
            Leave your PC on and plugged into a power source 24/7.
            <br />
            Your GPU will operate at its full capacity to generate the Proof of
            Space (PoS) data.
            <br />
            <br />
            The duration of this process depends on your hardware and setup,
            ranging from several days to a few weeks. While it may require
            significant effort initially, this is a one-time task.
            <br />
            <br />
            Once your PoS data is successfully generated, you'll be ready to set
            up a node and actively participate in the network to start earning
            rewards.
          </>
        }
      />
      <BackButton />
        <MainContainer>
          <PageTitleWrapper>
            <Header text={pageTitle} />
          </PageTitleWrapper>
          <TabsContainer>
            <VerticalTabs
              tabs={tabs}
              activeTab={activeTabId}
              onTabChange={handleTabChange}
              onCollapseChange={setIsTabsCollapsed}
            />
            {!isTabsCollapsed ? <GenerateButton /> : <NextButton />}
          </TabsContainer>

          {error && <ErrorMessage text={error} />}
        </MainContainer>
        <MetafileModal />
    </>
  );
};

export default Generate;

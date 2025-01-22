import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { executePostCliDetached } from '../../services/postcliService';
import { fetchLatestAtxId } from '../../services/postcliService';
import { usePOSProcess } from '../../state/POSProcessContext';
import { useSettings } from '../../state/SettingsContext';
import Colors from '../../styles/colors';
import { List, Subheader } from '../../styles/texts';
import { getDirectoryDisplay } from '../../utils/directoryUtils';
import { truncateHex, isValidHex } from '../../utils/hexUtils';
import { calculateNumFiles, calculateTotalSize } from '../../utils/sizeUtils';
import { Button } from '../button';
import Frame from '../frames';
import Modal from '../modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 420px;
  position: absolute;
  top: 0px;
`;

const SummarySection = styled.div`
  width: 800px;
  height: 420px;
  position: relative;
  top: 0px;
`;

const AdvancedSection = styled.div<{ isVisible: boolean }>`
  width: 800px;
  height: ${props => props.isVisible ? '280px' : '0px'};
  position: relative;
  top: 0px;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  opacity: ${props => props.isVisible ? '1' : '0'};
`;

interface POSSummaryProps {
  onProceed: () => void;
  isGenerating?: boolean;
  error?: string | null;
  updateConsole?: (command: string, output: string) => void;
  onStepChange?: (step: number) => void;
  onAdvancedVisibilityChange?: (isVisible: boolean) => void;
  initialAdvancedVisible?: boolean;
  showOnlyAdvanced?: boolean;
}

export const POSSummary: React.FC<POSSummaryProps> = ({
  onProceed,
  isGenerating: parentIsGenerating,
  updateConsole,
  onStepChange,
  initialAdvancedVisible = false,
  showOnlyAdvanced = false,
}) => {
  const navigate = useNavigate();
  const { settings, setSettings } = useSettings();
  const { startProcess, processState } = usePOSProcess();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isAdvancedVisible] = useState(initialAdvancedVisible);

  const isGenerating = parentIsGenerating || processState.isRunning || false;

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
        if (updateConsole) {
          updateConsole(
            'generate',
            'Fetching ATX ID before starting generation...'
          );
        }
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

      if (updateConsole) {
        updateConsole('generate', 'Starting POS data generation...');
      }

      // Now we can proceed with POS generation using the current settings
      const response = await executePostCliDetached(
        currentSettings,
        updateConsole
      );

      if (response && response.process_id) {
        if (updateConsole) {
          updateConsole(
            'generate',
            `POS generation started with process ID: ${response.process_id}`
          );
        }
        startProcess(response.process_id);
        setShowSuccessModal(true);
        onProceed(); // This will set isGenerating in parent

        // Navigate to progress page after showing success modal
        // Use a short delay to ensure the modal is visible
        setTimeout(() => {
          navigate('/progress');
        }, 1500); // Increased delay to ensure modal is visible
      } else {
        throw new Error('Failed to start POS generation process');
      }
    } catch (error) {
      console.error('Error starting POS generation:', error);
      if (updateConsole) {
        updateConsole(
          'generate',
          `Error starting POS generation: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }
  };

  return (
    <>
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

      <Container>
        <SummarySection>
          <Frame>
            <Subheader
              top={0}
              text="Click on each row to adjust the settings"
            />
          </Frame>
          {!showOnlyAdvanced && (
            <>
              <Frame
                heading="Where to Store POS Data"
                subheader={getDirectoryDisplay(
                  settings.selectedDir,
                  settings.defaultDir
                )}
                onClick={() => onStepChange?.(0)}
              />
              <Frame
                heading="How to Generate"
                subheader={settings.providerModel ? settings.providerModel : 'Not selected'}
                onClick={() => onStepChange?.(1)}
              />
              <Frame
                heading="How Much to Generate"
                subheader={`${
                  settings.numUnits || 4
                } Space Units | ${calculateTotalSize(settings.numUnits)}`}
                onClick={() => onStepChange?.(2)}
              />
            </>
          )}
          <AdvancedSection isVisible={isAdvancedVisible || showOnlyAdvanced}>
            <Frame
              heading="Identity Configuration"
              subheader={
                settings.publicKey
                  ? `Key: ${truncateHex(settings.publicKey, 8)}`
                  : 'Create New Identity'
              }
              onClick={() => onStepChange?.(3)}
            />
            <Frame
              heading="Max File Size"
              subheader={`${calculateNumFiles(
                settings.numUnits,
                settings.maxFileSize || 4096
              )} files, ${settings.maxFileSize} MiB each`}
              onClick={() => onStepChange?.(4)}
            />
            <Frame
              heading="ATX ID"
              subheader={
                settings.atxId
                  ? `ATX: ${truncateHex(settings.atxId, 8)}`
                  : 'Default'
              }
              onClick={() => onStepChange?.(5)}
            />
            <Frame
              heading="Split in Subsets"
              subheader="To Be Implemented"
              onClick={() => onStepChange?.(7)}
            />
          </AdvancedSection>
          {!showOnlyAdvanced && (
            <Button
              label={isGenerating ? 'Starting...' : 'Generate POS Data'}
              onClick={handleGenerateClick}
              width={250}
              height={56}
              top={40}
              left={275}
              disabled={isGenerating}
            />
          )}
        </SummarySection>
      </Container>
    </>
  );
};

export default POSSummary;

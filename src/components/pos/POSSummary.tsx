import React, { useState } from "react";
import styled from "styled-components";

import { executePostCliDetached } from "../../services/postcliService";
import { useSettings } from "../../state/SettingsContext";
import Colors from "../../styles/colors";
import { List } from "../../styles/texts";
import { shortenPath } from "../../utils/directoryUtils";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { Button } from "../button";
import Frame from "../frames";
import Modal from "../modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 660px;
  height: 400px;
  position: absolute;
  left: 0px;
  top: 0px;
  margin: 60px 15px 20px 15px;
`;

const SummarySection = styled.div`
  width: 660px;
  height: 250px;
  position: relative;
`;

interface POSSummaryProps {
  onProceed: () => void;
  isGenerating?: boolean;
  error?: string | null;
  updateConsole?: (command: string, output: string) => void;
}

export const POSSummary: React.FC<POSSummaryProps> = ({ onProceed, updateConsole }) => {
  const { settings } = useSettings();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateSettings = () => {
    const errors: string[] = [];

    // Check provider
    if (settings.provider === undefined) {
      errors.push("Provider must be selected");
    }

    // Check number of units
    if (!settings.numUnits || settings.numUnits < 4) {
      errors.push("Number of units must be at least 4");
    }

    // Check identity key format if provided
    if (settings.publicKey && !isValidHex(settings.publicKey)) {
      errors.push("Invalid identity key format");
    }

    // Check ATX ID format if provided
    if (!settings.atxId || !isValidHex(settings.atxId)) {
      errors.push("Correct ATX ID is required");
    }

    return errors;
  };

  const handleGenerateClick = async () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      await executePostCliDetached(settings, updateConsole);
      // Call onProceed to indicate successful start of background process
      onProceed();
    } catch (error) {
      console.error('Error starting POS generation:', error);
      if (updateConsole) {
        updateConsole('generate', `Error starting POS generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalSize = () => {
    const spaceUnits = settings.numUnits || 4;
    const sizeInGiB = spaceUnits * 64;
    if (sizeInGiB >= 1024) {
      return `${(sizeInGiB / 1024).toFixed(1)} TiB`;
    }
    return `${sizeInGiB} GiB`;
  };

  // Get the directory display information
  const getDirectoryDisplay = () => {
    if (settings.selectedDir) {
      return `Custom: ${shortenPath(settings.selectedDir, 20)}`;
    }
    return `Default: ${
      settings.defaultDir ? shortenPath(settings.defaultDir, 20) : "Loading..."
    }`;
  };

  return (
    <>
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
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

      <Container>
        <SummarySection>
          <Frame
            height={16}
            heading="POS Location"
            subheader={getDirectoryDisplay()}
          />
          <Frame
            height={16}
            heading="POS Size"
            subheader={`${
              settings.numUnits || 4
            } Space Units (${calculateTotalSize()})`}
          />
          <Frame
            height={16}
            heading="POS Provider"
            subheader={`Provider ID: ${settings.provider ?? "Not selected"}`}
          />
          <Frame
            height={16}
            heading="Proving Setup"
            subheader={`${settings.numCores || 8} CPU Cores | ${
              settings.numNonces || 288
            } Nonces`}
          />
          <Frame
            height={16}
            heading="Identity Configuration"
            subheader={
              settings.identityFile
                ? `File: ${shortenPath(settings.identityFile, 20)}`
                : settings.publicKey
                ? `Key: ${truncateHex(settings.publicKey, 8)}`
                : "Create New Identity"
            }
          />
          <Frame
            height={16}
            heading="ATX ID"
            subheader={
              settings.atxId
                ? `ATX: ${truncateHex(settings.atxId, 8)}`
                : "Default"
            }
          />
        </SummarySection>
        <Button
          label={isGenerating ? "Starting..." : "Generate POS Data"}
          onClick={handleGenerateClick}
          width={250}
          height={56}
          disabled={isGenerating}
        />
      </Container>
    </>
  );
};

export default POSSummary;

import React, { useState } from "react";
import styled from "styled-components";
import Frame from "./frames";
import { Button } from "./button";
import { useSettings } from "../state/SettingsContext";
import { shortenPath } from "../utils/directoryUtils";
import { truncateHex, isValidHex } from "../utils/hexUtils";
import Colors from "../styles/colors";
import Modal from "./modal";
import { List } from "../styles/texts";

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
}

const POSSummary: React.FC<POSSummaryProps> = ({ onProceed }) => {
  const { settings } = useSettings();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    if (settings.privateKey && !isValidHex(settings.privateKey)) {
      errors.push("Invalid identity key format");
    }

    // Check ATX ID format if provided
    if (settings.atxId && !isValidHex(settings.atxId)) {
      errors.push("Invalid ATX ID format");
    }

    // Check if either identity file or private key is provided
    if (!settings.identityFile && !settings.privateKey) {
      errors.push("Either identity file or private key must be provided");
    }

    // Check ATX ID is provided
    if (!settings.atxId) {
      errors.push("ATX ID must be provided");
    }

    return errors;
  };

  const handleGenerateClick = () => {
    const errors = validateSettings();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
    } else {
      onProceed();
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
      return `Custom: ${shortenPath(settings.selectedDir, 30)}`;
    }
    return `Default: ${settings.defaultDir ? shortenPath(settings.defaultDir, 30) : "Loading..."}`;
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
            subheader={`${settings.numUnits || 4} Space Units (${calculateTotalSize()})`}
          />
          <Frame
            height={16}
            heading="POS Provider"
            subheader={`Provider ID: ${settings.provider ?? 'Not selected'}`}
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
                : settings.privateKey
                ? `Key: ${truncateHex(settings.privateKey, 8)}`
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
          label="Generate POS Data"
          onClick={handleGenerateClick}
          width={250}
          height={56}
        />
      </Container>
    </>
  );
};

export default POSSummary;

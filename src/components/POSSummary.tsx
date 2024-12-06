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

const GeneratingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  border-radius: 10px;
  z-index: 10;
`;

const ErrorText = styled.div`
  color: ${Colors.red};
  margin-top: 10px;
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
  max-width: 600px;
  font-family: "Univers45", sans-serif;
  font-weight: 100;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.2em;
  margin-bottom: 10px;
  font-family: "Univers45", sans-serif;
  font-weight: 100;
`;

interface POSSummaryProps {
  onProceed: () => void;
  isGenerating?: boolean;
  error?: string | null;
}

const POSSummary: React.FC<POSSummaryProps> = ({ onProceed, isGenerating = false, error = null }) => {
  const { settings } = useSettings();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateSettings = () => {
    const errors: string[] = [];

    // Check directory selection
    if (!settings.selectedDir) {
      errors.push("POS directory must be selected");
    }

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
          {isGenerating && (
            <GeneratingOverlay>
              <LoadingText>Generating POS Data...</LoadingText>
              <LoadingText>This may take several days or weeks</LoadingText>
            </GeneratingOverlay>
          )}
          <Frame
            height={16}
            heading="POS Location"
            subheader={settings.selectedDir ? shortenPath(settings.selectedDir, 20) : "Not selected"}
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
        {error && <ErrorText>{error}</ErrorText>}
        <Button
          label={isGenerating ? "Generating..." : "Generate POS Data"}
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

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { executePostCliDetached } from "../../services/postcliService";
import { useSettings } from "../../state/SettingsContext";
import { usePOSProcess } from "../../state/POSProcessContext";
import Colors from "../../styles/colors";
import { List, Subheader } from "../../styles/texts";
import { getDirectoryDisplay } from "../../utils/directoryUtils";
import { truncateHex, isValidHex } from "../../utils/hexUtils";
import { calculateNumFiles, calculateTotalSize } from "../../utils/sizeUtils";
import { Button } from "../button";
import Frame from "../frames";
import Modal from "../modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 800px;
  height: 420px;
  position: absolute;
`;

const SummarySection = styled.div`
  width: 800px;
  height: 420px;
  position: relative;
`;

interface POSSummaryProps {
  onProceed: () => void;
  isGenerating?: boolean;
  error?: string | null;
  updateConsole?: (command: string, output: string) => void;
  onStepChange?: (step: number) => void;
}

export const POSSummary: React.FC<POSSummaryProps> = ({
  onProceed,
  isGenerating: parentIsGenerating,
  updateConsole,
  onStepChange,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { startProcess, processState } = usePOSProcess();
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isGenerating = parentIsGenerating || processState.isRunning || false;

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

    try {
      if (updateConsole) {
        updateConsole("generate", "Starting POS data generation...");
      }

      const response = await executePostCliDetached(settings, updateConsole);

      if (response && response.process_id) {
        if (updateConsole) {
          updateConsole(
            "generate",
            `POS generation started with process ID: ${response.process_id}`
          );
        }
        startProcess(response.process_id);
        setShowSuccessModal(true);
        onProceed(); // This will set isGenerating in parent

        // Navigate to progress page after showing success modal
        // Use a short delay to ensure the modal is visible
        setTimeout(() => {
          navigate("/progress");
        }, 1500); // Increased delay to ensure modal is visible
      } else {
        throw new Error("Failed to start POS generation process");
      }
    } catch (error) {
      console.error("Error starting POS generation:", error);
      if (updateConsole) {
        updateConsole(
          "generate",
          `Error starting POS generation: ${
            error instanceof Error ? error.message : "Unknown error"
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
          navigate("/progress");
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
              text="Click on each row to adjust the settings as needed"
            />{" "}
          </Frame>
          <Frame
            heading="POS Location"
            subheader={getDirectoryDisplay(
              settings.selectedDir,
              settings.defaultDir
            )}
            onClick={() => onStepChange?.(0)}
          />
          <Frame
            heading="POS Provider"
            subheader={`Provider ID: ${settings.provider ?? "Not selected"}`}
            onClick={() => onStepChange?.(1)}
          />
          <Frame
            heading="POS Size"
            subheader={`${
              settings.numUnits || 4
            } Space Units (${calculateTotalSize(
              settings.numUnits
            )}), ${calculateNumFiles(
              settings.numUnits,
              settings.maxFileSize || 4096
            )} files, ${settings.maxFileSize} MiB each`}
            onClick={() => onStepChange?.(2)}
          />
          <Frame
            heading="Identity Configuration"
            subheader={
              settings.publicKey
                ? `Key: ${truncateHex(settings.publicKey, 8)}`
                : "Create New Identity"
            }
            onClick={() => onStepChange?.(3)}
          />
          <Frame
            heading="ATX ID"
            subheader={
              settings.atxId
                ? `ATX: ${truncateHex(settings.atxId, 8)}`
                : "Default"
            }
            onClick={() => onStepChange?.(4)}
          />
        </SummarySection>
        <Button
          label={isGenerating ? "Starting..." : "Generate POS Data"}
          onClick={handleGenerateClick}
          width={250}
          height={56}
          top={40}
          disabled={isGenerating}
        />
      </Container>
    </>
  );
};

export default POSSummary;

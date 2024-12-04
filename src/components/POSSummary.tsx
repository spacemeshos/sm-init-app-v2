import React from "react";
import styled from "styled-components";
import Frame from "./frames";
import { Button } from "./button";
import { useSettings } from "../state/SettingsContext";
import { shortenPath } from "../utils/directoryUtils";
import { truncateHex } from "../utils/hexUtils";

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
}

const POSSummary: React.FC<POSSummaryProps> = ({ onProceed }) => {
  const { settings } = useSettings();

  const calculateTotalSize = () => {
    const spaceUnits = settings.numUnits || 4;
    const sizeInGiB = spaceUnits * 64;
    if (sizeInGiB >= 1024) {
      return `${(sizeInGiB / 1024).toFixed(1)} TiB`;
    }
    return `${sizeInGiB} GiB`;
  };

  return (
    <Container>
      <SummarySection>
        <Frame
          height={16}
          heading="POS Location"
          subheader={shortenPath(settings.selectedDir || "", 20)}
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
          subheader={`Provider ID: ${settings.provider || 0}`}
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
              : "New Identity will be created"
          }
        />
        <Frame
          height={16}
          heading="ATX ID"
          subheader={
            settings.atxId
              ? `ATX: ${shortenPath(settings.atxId, 20)}`
              : "Default - Highest"
          }
        />
      </SummarySection>
      <Button
        label="Generate POS Data"
        onClick={onProceed}
        width={250}
        height={56}
      />
    </Container>
  );
};

export default POSSummary;

import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Frame from "./frames";
import { Button } from "./button";
import { useSettings } from "../state/SettingsContext";
import { shortenPath } from "../utils/pathUtils";

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
          height={20}
          heading="POS Location"
          subheader={shortenPath(settings.selectedDir || "", 30)}
        />
        <Frame
          height={20}
          heading="POS Size"
          subheader={`${
            settings.numUnits || 4
          } Space Units (${calculateTotalSize()})`}
        />
        <Frame
          height={20}
          heading="POS Provider"
          subheader={`Provider ID: ${settings.provider || 0}`}
        />
        <Frame
          height={20}
          heading="Proving Setup"
          subheader={`${settings.numCores || 8} CPU Cores | ${
            settings.numNonces || 288
          } Nonces`}
        />
        <Frame
          height={20}
          heading="Identity Configuration"
          subheader={
            settings.identityFile
              ? `File: ${shortenPath(settings.identityFile, 20)}`
              : settings.atxId
              ? `ATX ID: ${settings.atxId.substring(0, 10)}...`
              : ""
          }
        />
      </SummarySection>
      <Button
        label="Generate POS Data"
        onClick={onProceed}
        width={250}
        height={56}
        backgroundColor={Colors.darkerPurple}
        borderColor={Colors.purpleLight}
      />
    </Container>
  );
};

export default POSSummary;

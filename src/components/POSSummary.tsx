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
  width: 1200px;
  height: 600px;
  position: relative;
  padding: 20px;
`;

const SummarySection = styled.div`
  width: 800px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro", sans-serif;
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
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
      <Title>Setup Summary</Title>

      <SummarySection>
        <Frame
          height={60}
          heading="Storage Location"
          subheader={shortenPath(settings.selectedDir || "", 30)}
        />
      </SummarySection>

      <SummarySection>
        <Frame
          height={60}
          heading="Space Configuration"
          subheader={`${
            settings.numUnits || 4
          } Space Units (${calculateTotalSize()})`}
        />
      </SummarySection>

      <SummarySection>
        <Frame
          height={60}
          heading="Processing Setup"
          subheader={`Provider ID: ${settings.provider || 0} | ${
            settings.numCores || 8
          } CPU Cores | ${settings.numNonces || 288} Nonces`}
        />
      </SummarySection>

      {(settings.identityFile || settings.atxId) && (
        <SummarySection>
          <Frame
            height={60}
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
      )}

      <ButtonContainer>
        <Button
          label="Proceed with Setup"
          onClick={onProceed}
          width={250}
          height={60}
          backgroundColor={Colors.darkerPurple}
          borderColor={Colors.purpleLight}
        />
      </ButtonContainer>
    </Container>
  );
};

export default POSSummary;

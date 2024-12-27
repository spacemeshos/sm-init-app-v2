import * as React from "react";
import styled from "styled-components";
import Modal from "./modal";
import { Subheader, Header } from "../styles/texts";

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 250px;
  margin: 10px 0;
`;

interface ProfilerResult {
  time_s: number;
  speed_gib_s: number;
}

interface ProfilerResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ProfilerResult | null;
}

export const ProfilerResultModal: React.FC<ProfilerResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!result) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={600} height={50}>
      <Header text="Proving Capacity Results" />
      <ResultContainer>
        <ResultRow>
          <Subheader text="Time:" />
          <Subheader text={`${result.time_s.toFixed(2)} seconds`} />
        </ResultRow>
        <ResultRow>
          <Subheader text="Speed:" />
          <Subheader text={`${result.speed_gib_s.toFixed(2)} GiB/s`} />
        </ResultRow>
      </ResultContainer>
    </Modal>
  );
};

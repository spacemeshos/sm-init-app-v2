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
  width: 300px;
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const ResultLabel = styled(Subheader)`
  color: #666;
`;

const ResultValue = styled(Subheader)`
  color: #000;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 0 40px 20px 40px;
  line-height: 1.5;
`;

interface ProfilerResult {
  nonces: number;
  threads: number;
  time_s: number;
  speed_gib_s: number;
  data_size: number;
  duration: number;
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
    <Modal isOpen={isOpen} onClose={onClose} width={600} height={80}>
      <Header text="Proving Capacity Results" />
      <Description>
        These results show your system's performance in generating Proof of
        Space-Time (PoST). The speed indicates how fast your system can process
        data, which helps determine the optimal amount of space you can allocate
        for smeshing.
      </Description>
      <ResultContainer>
        <ResultRow>
          <ResultLabel text="Nonces:" />
          <ResultValue text={result.nonces.toString()} />
        </ResultRow>
        <ResultRow>
          <ResultLabel text="CPU Threads:" />
          <ResultValue text={result.threads.toString()} />
        </ResultRow>
        <ResultRow>
          <ResultLabel text="Time:" />
          <ResultValue text={`${result.time_s.toFixed(2)} seconds`} />
        </ResultRow>
        <ResultRow>
          <ResultLabel text="Speed:" />
          <ResultValue text={`${result.speed_gib_s.toFixed(2)} GiB/s`} />
        </ResultRow>
        <ResultRow>
          <ResultLabel text="Data Size:" />
          <ResultValue text={`${result.data_size} GiB`} />
        </ResultRow>
        <ResultRow>
          <ResultLabel text="Test Duration:" />
          <ResultValue text={`${result.duration} seconds`} />
        </ResultRow>
      </ResultContainer>
    </Modal>
  );
};

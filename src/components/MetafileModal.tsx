import styled from 'styled-components';

import { useMetadataFile } from '../hooks/useMetadataFile';
import { ErrorMessage } from '../styles/texts';

import { Button } from './button';
import Modal from './modal';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  flex-direction: row;
  gap: 20px;
`;

export const MetafileModal = () => {

  const {
    isOpen,
    error,
    handleLoadMetadata,
    handleRejectMetadata,
  } = useMetadataFile();

  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleRejectMetadata}
        header="Problems with PoS directory"
        text={
          <ErrorMessage>
            {error}
          </ErrorMessage>
        }
        width={600}
        height={300}
      >
        <ButtonWrapper>
          <Button label="Choose another directory" onClick={handleRejectMetadata} width={200} />
        </ButtonWrapper>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleRejectMetadata}
      header="Existing PoS Data Found"
      text="This directory already contains some PoS data. Do you want to load settings from there?"
      width={600}
      height={300}
    >
      <ButtonWrapper>
        <Button label="Yes, load settings" onClick={handleLoadMetadata} width={200} />
        <Button label="No, choose another directory" onClick={handleRejectMetadata} width={200} />
      </ButtonWrapper>
    </Modal>
  );
};

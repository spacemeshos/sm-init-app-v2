import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { Button } from "./button";

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Input = styled.input`
  margin-top: 10px;
  padding: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ModalButton = styled(Button)`
  margin-top: 20px;
`;

interface ModalProps {
  isOpen: boolean;
  onSelect: (directory: string) => void; 
  onClose: () => void;
}

const DirectorySelectionModal: React.FC<ModalProps> = ({ isOpen = false, onClose, onSelect}) => {
  const [directory, setDirectory] = useState("");

  const handleSelect = () => {
    onSelect(directory);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <ModalContent>
        <h2>Select Directory</h2>
        <Input
          type="text"
          placeholder="Enter directory path"
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
        />
        <ModalButton label="Select" onClick={handleSelect} />
      </ModalContent>
    </Modal>
  );
};

export default DirectorySelectionModal;

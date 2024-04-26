import React, { useEffect } from 'react';
import styled from 'styled-components';
import Colors from "../styles/colors";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.background};
  z-index: 10;
`;

const ModalWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba;
  min-width: 320px;
  z-index: 100;
`;

const Header = styled.h2`
  margin-top: 0;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return isOpen ? (
    <Backdrop onClick={() => onClose()}>
      <ModalWrapper onClick={e => e.stopPropagation()}>
        {title && <Header>{title}</Header>}
        {children}
      </ModalWrapper>
    </Backdrop>
  ) : null;
};

export default Modal;

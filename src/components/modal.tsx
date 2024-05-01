import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

const Backdrop = styled.div<{ modalZIndex?: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ modalZIndex }) => modalZIndex || 2};
`;

const Wrapper = styled.div<{
  width: number;
  height: number;
  modalZIndex: number;
  top: number;
  left: number;
}>`
  position: relative;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.background};
  z-index: ${({ modalZIndex }) =>
    modalZIndex + 1}; // Ensure modal content is above the backdrop
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
`;

const Header = styled.h1`
  color: ${Colors.white};
  margin-bottom: 15px;
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 14px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
`;

const Text = styled.span`
  color: ${Colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 14px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${Colors.purpleLight};
  cursor: pointer;
  font-size: 24px;
`;

type Props = {
  header: string;
  text: string;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  modalZIndex?: number;
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal = ({
  header,
  text,
  children,
  width = 99,
  height = 99,
  top = 0,
  left = 0,
  modalZIndex = 1,
  onClose,
  isOpen,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Backdrop modalZIndex={modalZIndex} onClick={onClose}>
      <Wrapper
        onClick={(e) => e.stopPropagation()}
        width={width}
        height={height}
        top={top}
        left={left}
        modalZIndex={modalZIndex}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>{header}</Header>
        <Text>{text}</Text>
        {children}
      </Wrapper>
    </Backdrop>
  );
};

export default Modal;

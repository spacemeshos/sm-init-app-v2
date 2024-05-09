import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

const Backdrop = styled.div<{isOpen?: boolean}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ isOpen }) => (isOpen ? 1000 : -2)}
  position: absolute
`;

const Wrapper = styled.div<{
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  isOpen?: boolean;
}>`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.background};
  z-index: ${({ isOpen }) => (isOpen ? 1000 : -1)}
  width: ${({ width }) => width || 90}%;
  height: ${({ height }) => height || 90}%;
`;

const Header = styled.h1`
  color: ${Colors.white};
  text-align: center;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-size: 16px;
  margin-top: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
`;

const Text = styled.div`
  color: ${Colors.white};
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-size: 16px;
  font-weight: 100;
  line-height: 25px;
  white-space: pre-wrap
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${Colors.purpleLight};
  cursor: pointer;
  font-size: 28px;
`;

type Props = {
  header?: string;
  text?:  React.ReactNode;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

const Modal = ({
  header,
  text,
  children,
  width,
  height,
  top,
  left,
  onClose,
  isOpen,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <Wrapper
        onClick={(e) => e.stopPropagation()}
        width={width}
        height={height}
        top={top}
        left={left}
        isOpen={isOpen}
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

import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { CloseButton } from "./button";

const Backdrop = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ isOpen }) => (isOpen ? 9999 : -1)};
`;

const Wrapper = styled.div<{
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  isOpen?: boolean;
}>`
  position: absolute;
  top: ${({ top }) => top || 50}%;
  left: ${({ left }) => left || 50}%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.greenDark};
  width: ${({ width }) => width || 500}px;
  height: ${({ height }) => height || 80}%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  white-space: pre-wrap;
`;

type Props = {
  header?: string;
  text?: React.ReactNode;
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
  onClose,
  isOpen,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose} isOpen={isOpen}>
      <Wrapper
        onClick={(e) => e.stopPropagation()}
        width={width}
        height={height}
        isOpen={isOpen}
      >
        <CloseButton onClick={onClose} top={2} left={97} />
        <Header>{header}</Header>
        <Text>{text}</Text>
        {children}
      </Wrapper>
    </Backdrop>
  );
};

export default Modal;

import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { CloseButton } from "./button";

const Backdrop = styled.div<{ isOpen?: boolean }>`
  position: fixed; // Changed from absolute to fixed
  top: 0;
  left: 0;
  width: 100vw; // Changed from 100% to 100vw
  height: 100vh; // Changed from 100% to 100vh
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // Added semi-transparent background
  z-index: ${({ isOpen }) => (isOpen ? 9999 : -1)}; // Increased z-index
`;

const Wrapper = styled.div<{
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  isOpen?: boolean;
}>`
  position: relative; // Changed from absolute to relative
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.greenDark};
  width: ${({ width }) => width || 98}%;
  height: ${({ height }) => height || 98}%;
  border-radius: 8px; // Added border radius
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Added shadow
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

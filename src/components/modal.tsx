import React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";
import { BodyText, Header } from "../styles/texts";

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
  height: ${({ height }) => height || 60}%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Head = styled.div`
  margin-top: 20px;
`;

const Text = styled.div`
  padding: 35px;
  margin-top: 10px;
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
        <Head><Header text={header}/></Head>
        <Text><BodyText text={text}/></Text>
        {children}
      </Wrapper>
    </Backdrop>
  );
};

export default Modal;

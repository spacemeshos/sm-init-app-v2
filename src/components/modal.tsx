import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";

const Backdrop = styled.div<{
  modalZIndex?: number;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ modalZIndex }) => modalZIndex || 999}
`;

const Wrapper = styled.div<{
  modalZIndex?: number;
  width: number;
  height: number;
}>`
  position: relative; // Relative to the backdrop
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.background};
  z-index: ${({ modalZIndex }) => modalZIndex || 1000};
  padding: 20px; // Padding around content
  border-radius: 8px; // Optional styling
`;

const Header = styled.h1<{ color?: string }>`
  color: ${({ color }) => color || Colors.white};
  margin-bottom: 0.5em;
`;

const SubHeader = styled.h2<{ color?: string }>`
  color: ${({ color }) => color || Colors.white};
  margin-bottom: 1em;
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
  subHeader?: string;
  width?: number;
  height?: number;
  headerColor?: string;
  indicatorColor?: string;
  modalZIndex?: number;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({
  header,
  subHeader = "",
  headerColor,
  indicatorColor,
  children,
  width = 520,
  height = 310,
  modalZIndex = 1000,
  onClose,
}: Props) => {
  return (
    <Backdrop modalZIndex={modalZIndex -1} onClick={onClose}>
      <Wrapper onClick={e => e.stopPropagation()}  modalZIndex={modalZIndex} width={width} height={height}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header color={headerColor}>{header}</Header>
        {subHeader && <SubHeader color={indicatorColor}>{subHeader}</SubHeader>}
        {children}
      </Wrapper>
    </Backdrop>
  );
};

export default Modal;

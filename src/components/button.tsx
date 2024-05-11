import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./modal";

interface ButtonProps {
  iconSrc?: any;
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  borderColor?: any;
  backgroundColor?: any;
}

// Standard Button component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  top,
  left,
  width,
  height,
  backgroundColor,
  borderColor,
}) => {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <ButtonWrapper
      onClick={handleClick}
      role="button"
      tabIndex={0}
      top={top}
      left={left}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    >
      <ButtonText>{label}</ButtonText>
    </ButtonWrapper>
  );
};

// BackButton component
const BackButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const back = require("../assets/left-arrow.png");
  const navigate = useNavigate();
  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <NavWrapper onClick={handleBack} role="button" tabIndex={0} left={67}>
      <NavIcon src={back} alt="Back" />
    </NavWrapper>
  );
};

// Forward Arrow Button component
const ForwardButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const next = require("../assets/right-arrow.png");
  const navigate = useNavigate();
  const handleForward = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(1);
    }
  };

  return (
    <NavWrapper onClick={handleForward} role="button" tabIndex={0} left={1087}>
      <NavIcon src={next} alt="Back" />
    </NavWrapper>
  );
};

// Edit button component
const EditButton: React.FC<{
  onClick?: () => void;
  modalHeader?: string;
  modalText?: React.ReactNode;
  EditButtonTop?: number;
  EditButtonLeft?: number;
  modalTop?: number;
  modalLeft?: number;
  modalComponent?: React.ElementType;
}> = ({
  onClick,
  modalHeader,
  modalText,
  EditButtonTop = 0,
  EditButtonLeft = 0,
  modalTop,
  modalLeft,
  modalComponent: CustomModal,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const pen = require("../assets/edit-circle.png");

  const openTooltip = () => {
    setModalOpen(true);
    if (typeof onClick === "function") {
      onClick();
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      {!isModalOpen && (
        <IconButtonWrapper
          onClick={openTooltip}
          role="button"
          tabIndex={0}
          top={EditButtonTop}
          left={EditButtonLeft}
        >
          <ButtonIcon src={pen} alt="pen" />
        </IconButtonWrapper>
      )}
      {isModalOpen && CustomModal ? (
        <CustomModal isOpen={isModalOpen} onClose={closeModal} />
      ) : (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          header={modalHeader}
          text={modalText}
          top={modalTop}
          left={modalLeft}
        />
      )}
    </>
  );
};

// Tooltip button component
const IconButton: React.FC<{
  onClick?: () => void;
  modalHeader?: string;
  modalText?: React.ReactNode;
  IconButtonTop?: number;
  IconButtonLeft?: number;
  modalTop?: number;
  modalLeft?: number;
  modalComponent?: React.ElementType;
}> = ({
  onClick,
  modalHeader,
  modalText,
  IconButtonTop = 0,
  IconButtonLeft = 0,
  modalTop,
  modalLeft,
  modalComponent: CustomModal,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const question = require("../assets/question.png");

  const openTooltip = () => {
    setModalOpen(true);
    if (typeof onClick === "function") {
      onClick();
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      {!isModalOpen && (
        <IconButtonWrapper
          onClick={openTooltip}
          role="button"
          tabIndex={0}
          top={IconButtonTop}
          left={IconButtonLeft}
        >
          <ButtonIcon src={question} alt="question" />
        </IconButtonWrapper>
      )}
      {isModalOpen && CustomModal ? (
        <CustomModal isOpen={isModalOpen} onClose={closeModal} />
      ) : (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          header={modalHeader}
          text={modalText}
          top={modalTop}
          left={modalLeft}
        />
      )}
    </>
  );
};

const ButtonWrapper = styled.button<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  borderColor?: string;
  backgroundColor?: string;
}>`
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  height: ${({ height }) => height || 60}px;
  width: ${({ width }) => width || 300}px;

  background-color:${({ backgroundColor }) =>
    backgroundColor || "transparent"};;
  cursor: pointer;
  padding: 10px;
  z-index: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;

  border: 1px solid ${({ borderColor }) => borderColor || "transparent"};
  border-image-slice: 1;
  border-image: ${({ borderColor }) =>
    borderColor
      ? "none"
      : `linear-gradient(
          90deg,
          ${Colors.greenLight} 0%,
          ${Colors.greenDark} 50%,
          ${Colors.greenLight} 100%
        ) 1`};

  &:hover {
    border-image-slice: 1;
    border-image: ${({ borderColor }) =>
      borderColor
        ? "none"
        : `linear-gradient(
            90deg,
            ${Colors.greenDark} 0%,
            ${Colors.greenLight} 50%,
            ${Colors.greenDark} 100%
          ) 1`};
`;


const ButtonText = styled.span`
  font-family: "Source Code Pro Extralight", sans-serif;
  color: ${Colors.white};
  font-size: 14px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
`;

const NavIcon = styled.img`
  aspect-ratio: 1;
  width: 45px;
`;

const NavWrapper = styled.button<{ top?: number; left?: number }>`
  top: ${({ top }) => top || 96}px;
  left: ${({ left }) => left || 0}px;
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 1;
  height: 45px;
  position: absolute;
`;

const ButtonIcon = styled.img`
  aspect-ratio: 1;
  width: 30px;
`;

const IconButtonWrapper = styled.button<{ top: number; left: number }>`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  transform: translate(
    -50%,
    0%
  ); // Centers the image both horizontally and vertically
`;

export { Button, BackButton, ForwardButton, IconButton, EditButton };

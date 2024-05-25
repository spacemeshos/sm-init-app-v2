import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./modal";

// Interface defining the properties for the Button component below
interface ButtonProps {
  iconSrc?: any;
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  buttonTop?: number;
  buttonLeft?: number;
  height?: number;
  width?: number;
  borderColor?: any;
  backgroundColor?: any;
  modalHeader?: string;
  modalText?: React.ReactNode;
  modalTop?: number;
  modalLeft?: number;
  modalComponent?: React.ElementType;
}

// Standard Button component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  buttonTop,
  buttonLeft,
  height,
  width,
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
      top={buttonTop}
      left={buttonLeft}
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
  const navigate = useNavigate(); // Hook for navigation

  // Handle back button click
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

// Icon button component
const IconButton: React.FC<ButtonProps> = ({
  onClick,
  modalHeader,
  modalText,
  modalTop,
  modalLeft,
  buttonTop = 96,
  buttonLeft = 50,
  modalComponent: CustomModal,
  iconSrc,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  // Open modal tooltip
  const openTooltip = () => {
    setModalOpen(true);
    if (typeof onClick === "function") {
      onClick();
    }
  };
  // Close modal
  const closeModal = () => setModalOpen(false);

  return (
    <>
      {!isModalOpen && (
        <IconButtonWrapper
          onClick={openTooltip}
          role="button"
          tabIndex={0}
          buttonTop={buttonTop}
          buttonLeft={buttonLeft}
        >
          <ButtonIcon src={iconSrc} />
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

// Edit button component
const EditButton: React.FC<ButtonProps> = (props) => {
  const pen = require("../assets/edit-circle.png");

  return <IconButton {...props} iconSrc={pen} />;
};

// Tooltip button component
const TooltipButton: React.FC<ButtonProps> = (props) => {
  const question = require("../assets/question.png");

  return <IconButton {...props} iconSrc={question} />;
};

// Save button component
const SaveButton: React.FC<ButtonProps> = (props) => {
  const save = require("../assets/check-circle.png");

  return <IconButton {...props} iconSrc={save} />;
};


// Styled component for the standard button wrapper
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
    border: 1px solid ${({ borderColor }) => borderColor || Colors.greenLight};
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

// Styled component for the navigation icon image
const NavIcon = styled.img`
  aspect-ratio: 1;
  width: 45px;
`;

// Styled component for the navigation button wrapper
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
// Styled component for the icon button wrapper
const IconButtonWrapper = styled.button<{
  buttonTop: number;
  buttonLeft: number;
}>`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: ${({ buttonTop }) => buttonTop}%;
  left: ${({ buttonLeft }) => buttonLeft}%;
  transform: translate(
    -50%,
    0%
  ); // Centers the image both horizontally and vertically
`;

export { Button, BackButton, ForwardButton, IconButton, EditButton, TooltipButton, SaveButton};

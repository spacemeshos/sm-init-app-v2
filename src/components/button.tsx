import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./modal";
import back from "../assets/left-arrow.png";
import next from "../assets/right-arrow.png";
import pen from "../assets/edit-circle.png";
import question from "../assets/question.png";
import save from "../assets/check-circle.png";
import cancel from "../assets/circle-x.png";

// Interface defining the properties for the Button component below
interface ButtonProps {
  iconSrc?: string;
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  buttonTop?: number;
  buttonLeft?: number;
  buttonMargin?: number;
  height?: number;
  width?: number;
  borderColor?: string;
  backgroundColor?: string;
  modalHeader?: string;
  modalText?: React.ReactNode;
  modalTop?: number;
  modalLeft?: number;
  showModal?: boolean;
  size?: number;
  modalComponent?: React.ElementType;
  $isActive?: boolean;
}

// Standard Button component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  buttonTop,
  buttonLeft,
  buttonMargin,
  height,
  width,
  backgroundColor,
  borderColor,
  $isActive,
}) => {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <StandardButton
      onClick={handleClick}
      role="button"
      tabIndex={0}
      buttonTop={buttonTop}
      buttonLeft={buttonLeft}
      buttonMargin={buttonMargin}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      $isActive={$isActive}
    >
      <ButtonText>{label}</ButtonText>
    </StandardButton>
  );
};

// BackButton component
const BackButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
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
  const navigate = useNavigate();

  // Handle forward button click
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
  size,
  buttonTop = 96,
  buttonLeft = 50,
  modalComponent: CustomModal,
  iconSrc,
  showModal = true, // Default to true for buttons that need modals
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    if (showModal) {
      setModalOpen(true);
    }
    if (typeof onClick === "function") {
      onClick();
    }
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      {!isModalOpen && (
        <IconStandardButton
          onClick={handleClick}
          role="button"
          tabIndex={0}
          buttonTop={buttonTop}
          buttonLeft={buttonLeft}
        >
          <ButtonIcon src={iconSrc} size={size} />
        </IconStandardButton>
      )}
      {isModalOpen &&
        showModal &&
        (CustomModal ? (
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
        ))}
    </>
  );
};

// Edit button component
const EditButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={pen} showModal />;
};

// Tooltip button component
const TooltipButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={question} showModal />;
};

// Save button component
const SaveButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={save} showModal={false} />;
};

// Cancel button component
const CancelButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={cancel} showModal={false} />;
};

// Styled component for the standard button wrapper
const StandardButton = styled.button<{
  buttonTop?: number;
  buttonLeft?: number;
  height?: number;
  width?: number;
  buttonMargin?: number;
  borderColor?: string;
  backgroundColor?: string;
  $isActive?: boolean;
}>`
  top: ${({ buttonTop }) => buttonTop || 0}px;
  left: ${({ buttonLeft }) => buttonLeft || 0}px;
  height: ${({ height }) => height || 60}px;
  width: ${({ width }) => width || 300}px;
  background-color: ${Colors.whiteOpaque};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 10px;
  margin: ${({ buttonMargin }) => buttonMargin || 0}px;
  z-index: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  border-radius: 45px;
  border: 0.5px solid
    ${(props) =>
      props.$isActive ? Colors.whiteOpaque : Colors.greenLightOpaque};

  &:hover {
    background-color: ${Colors.greenLightOpaque};
    border: 1px solid ${Colors.whiteOpaque};
  }
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

const ButtonIcon = styled.img<{ size?: number }>`
  aspect-ratio: 1;
  width: ${({ size }) => size || 30}px;
`;

// Styled component for the icon button wrapper
const IconStandardButton = styled.button<{
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

export {
  Button,
  BackButton,
  ForwardButton,
  IconButton,
  EditButton,
  TooltipButton,
  SaveButton,
  CancelButton,
};

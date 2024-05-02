import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./modal";

interface ButtonProps {
  imageSrc?: string;
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Standard Button component
const Button: React.FC<ButtonProps> = ({ imageSrc, label, onClick }) => {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <ButtonWrapper onClick={handleClick} role="button" tabIndex={0}>
      {imageSrc && <ButtonImage src={imageSrc} alt="" />}
      <ButtonText>{label}</ButtonText>
    </ButtonWrapper>
  );
};

// Settings Tiles Button component
const TileButton: React.FC<ButtonProps> = ({ imageSrc, label, onClick }) => {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <TileButtonWrapper onClick={handleClick} role="button" tabIndex={0}>
      {imageSrc && <ButtonImage src={imageSrc} alt="" />}
      <ButtonText>{label}</ButtonText>
    </TileButtonWrapper>
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
    <BackWrapper onClick={handleBack} role="button" tabIndex={0}>
      <BackIcon src={back} alt="Back" />
    </BackWrapper>
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
    <ForwardkWrapper onClick={handleForward} role="button" tabIndex={0}>
      <ForwardIcon src={next} alt="Back" />
    </ForwardkWrapper>
  );
};

// Tooltip button component
const TooltipButton: React.FC<{
  onClick?: () => void,
  modalHeader?: string,
  modalText: string,
  modalTop?: number,
  modalLeft?: number,
}> = ({ onClick, modalHeader, modalText, modalTop, modalLeft }) => {
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
        <TooltipWrapper onClick={openTooltip} role="button" tabIndex={0}>
          <HintIcon src={question} alt="question" />
        </TooltipWrapper>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        header={modalHeader}
        text={modalText}
        top={modalTop}
        left={modalLeft}
        children
      />
    </>
  );
};

const ButtonWrapper = styled.button`
  border: 2px solid transparent;
  background-color: transparent;
  cursor: pointer;
  padding: 15px;
  margin: 20px;
  transition: border-color 0.3s ease;
  z-index: 1;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  /* Gradient border */
  border-image: linear-gradient(
    90deg,
    ${Colors.greenDark} 0%,
    ${Colors.greenLight} 50%,
    ${Colors.greenDark} 100%
  );
  border-image-slice: 1;

  @media (max-width: 991px) {
    white-space: initial;
  }

  &:hover {
    border-image: linear-gradient(
      90deg,
      ${Colors.greenLight} 0%,
      ${Colors.greenDark} 50%,
      ${Colors.greenLight} 100%
    ); /* Disable the border-image on hover */
    border-image-slice: 1;
  }
`;

const ButtonImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 30px;
  position: absolute;
  left: 20px;
`;

const ButtonText = styled.span`
  font-family: "Source Code Pro ExtraLight", sans-serif;
  color: ${Colors.white};
  font-size: 14px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 20px;
`;

const TileButtonWrapper = styled.button`
  border: 1px solid ${Colors.purpleLight};
  background-color: ${Colors.darkerPurple};
  cursor: pointer;
  padding: 15px;
  z-index: 1;
  height: 50px;
  width: 375px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 258px;
  left: 38px;
`;

const BackIcon = styled.img`
  aspect-ratio: 1;
  width: 45px;
`;

const BackWrapper = styled.button`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 1;
  height: 45px;
  position: absolute;
  top: 96px;
  left: 67px;
`;

const ForwardIcon = styled.img`
  aspect-ratio: 1;
  width: 45px;
`;

const ForwardkWrapper = styled.button`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 1;
  height: 45px;
  position: absolute;
  top: 96px;
  right: 67px;
`;

const HintIcon = styled.img`
  aspect-ratio: 1;
  width: 30px;
`;

const TooltipWrapper = styled.button`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 1;
  position: absolute;
  top: 96%;
  left: 46%;
`;

export { Button, TileButton, BackButton, ForwardButton, TooltipButton };

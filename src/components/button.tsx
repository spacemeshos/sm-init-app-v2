import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import back from "../assets/left-arrow.png";
import next from "../assets/right-arrow.png";
import pen from "../assets/edit-circle.png";
import save from "../assets/check-circle.png";
import cancel from "../assets/circle-x.png";

// Interface defining the properties for the Button component below
interface ButtonProps {
  iconSrc?: string;
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  top?: number;
  left?: number;
  margin?: number;
  height?: number;
  width?: number;
  size?: number;
  modalComponent?: React.ElementType;
  $isActive?: boolean;
  disabled?: boolean;
  rounded?: number;
}

// Standard Button component
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  top,
  left,
  margin,
  height,
  width,
  $isActive,
  disabled,
  rounded,
}) => {
  const handleClick = () => {
    if (!disabled && typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <StandardButton
      onClick={handleClick}
      role="button"
      tabIndex={0}
      top={top}
      left={left}
      margin={margin}
      width={width}
      height={height}
      $isActive={$isActive}
      disabled={disabled}
      rounded={rounded}
    >
      <ButtonText disabled={disabled}>{label}</ButtonText>
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
  size,
  top = 96,
  left = 50,
  iconSrc,
}) => {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <>
      <IconStandardButton
        onClick={handleClick}
        role="button"
        tabIndex={0}
        top={top}
        left={left}
      >
        <ButtonIcon src={iconSrc} size={size} />
      </IconStandardButton>
    </>
  );
};

// Edit button component
const EditButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={pen} />;
};

// Tooltip button component

// Save button component
const SaveButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={save} />;
};

// Cancel button component
const CancelButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={cancel} />;
};

// Styled component for the standard button wrapper
const StandardButton = styled.button<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  margin?: number;
  $isActive?: boolean;
  disabled?: boolean;
  rounded?: number;
}>`
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  height: ${({ height }) => height || 60}px;
  width: ${({ width }) => width || 300}px;
  background-color: ${({ disabled }) =>
    disabled ? Colors.grayMedium : Colors.whiteOpaque};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  padding: 10px;
  margin: ${({ margin }) => margin || 0}px;
  z-index: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  border-radius: ${({ rounded }) => rounded || 45}px;
  border: 0.5px solid
    ${(props) =>
      props.$isActive ? Colors.whiteOpaque : Colors.greenLightOpaque};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? Colors.grayMedium : Colors.greenLightOpaque};
    border: 1px solid ${Colors.whiteOpaque};
  }
`;

const ButtonText = styled.span<{ disabled?: boolean }>`
  font-family: "Source Code Pro Extralight", sans-serif;
  color: ${({ disabled }) => (disabled ? Colors.grayLight : Colors.white)};
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
  top: number;
  left: number;
}>`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  transform: translate(-50%, 0%);
`;

export {
  Button,
  BackButton,
  ForwardButton,
  IconButton,
  EditButton,
  SaveButton,
  CancelButton,
};

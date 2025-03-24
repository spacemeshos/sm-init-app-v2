/**
 * @fileoverview Button components collection
 * Provides a comprehensive set of button components with consistent styling
 * and behavior. Includes standard, transparent, icon, and navigation buttons.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import back from "../assets/back.png";
import save from "../assets/check.png";
import pen from "../assets/edit.png";
import next from "../assets/next.png";
import close from "../assets/x.png";
import Colors from "../styles/colors";
import { blur } from '../styles/mixins';

/**
 * Common props interface for all button components
 * @interface ButtonProps
 */
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
  transparent?: boolean;
  alt?: string;
  opacity?: number;
}

/**
 * Standard Button Component
 * Primary button with gradient background and hover effects
 */
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
  opacity,
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
      opacity={opacity}
    >
      <ButtonText disabled={disabled}>{label}</ButtonText>
    </StandardButton>
  );
};

/**
 * Transparent Button Component
 * Ghost button with hover underline effect
 */
const TransparentButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  top,
  left,
  margin,
  height,
  width,
  $isActive,
  disabled,
  iconSrc,
}) => {
  const handleClick = () => {
    if (!disabled && typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <TransparentRectangle
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
    >
      {iconSrc && <ButtonIcon src={iconSrc} size={24} />}
      {label && (
        <ButtonText disabled={disabled} transparent>
          {label}
        </ButtonText>
      )}
    </TransparentRectangle>
  );
};

/**
 * Back Navigation Button
 * Handles browser history navigation or custom back action
 */
const BackButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <NavWrapper onClick={handleBack} role="button" tabIndex={0} left={50}>
      <NavIcon src={back} alt="Back" />
    </NavWrapper>
  );
};

/**
 * Forward Navigation Button
 * Handles browser history navigation or custom forward action
 */
const ForwardButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
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

/**
 * Icon Button Base Component
 * Used by specialized icon buttons (Edit, Save, Cancel, Close)
 */
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

/**
 * Specialized Icon Buttons
 * Pre-configured with specific icons and behaviors
 */
const EditButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={pen} />;
};

const SaveButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={save} />;
};

const CancelButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={close} />;
};

const CloseButton: React.FC<ButtonProps> = (props) => {
  return <IconButton {...props} iconSrc={close} size={24} />;
};

/**
 * Dot Button Component
 * Toggle button with animated dot indicator
 */
const DotButton: React.FC<ButtonProps> = ({
  iconSrc,
  alt,
  top,
  left,
  width,
  onClick,
  $isActive,
  disabled,
}) => {
  const handleClick = () => {
    if (!disabled && typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <DotWrapper onClick={handleClick} role="button">
      <Dot $isActive={$isActive} />
      <Square>
        {iconSrc && (
          <DotIcon
            src={iconSrc}
            alt={alt}
            top={top}
            left={left}
            width={width}
          />
        )}
      </Square>
    </DotWrapper>
  );
};

// Styled Components

/**
 * Standard button styling
 * Features gradient background and hover effects
 */
const StandardButton = styled.button<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  margin?: number;
  $isActive?: boolean;
  disabled?: boolean;
  opacity?: number;
}>`
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  height: ${({ height }) => height || 42}px;
  width: ${({ width }) => width || 200}px;
  background: ${({ disabled }) =>
    disabled ? Colors.grayMedium : Colors.gradientGB};
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
  border-radius: 30px;
  border: 0.5px solid
    ${(props) =>
      props.$isActive ? Colors.whiteOpaque : Colors.greenLightOpaque};
  opacity: ${({ disabled, opacity }) => opacity || (disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? Colors.grayMedium : Colors.greenLightOpaque};
    border: 1px solid ${Colors.whiteOpaque};
  }

  user-select: none;
  -webkit-user-select: none;
`;

/**
 * Transparent button styling
 * Features underline hover effect
 */
const TransparentRectangle = styled.button<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  margin?: number;
  $isActive?: boolean;
  disabled?: boolean;
}>`
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  height: ${({ height }) => height || 56}px;
  width: ${({ width }) => width || 200}px;
  background: ${({ disabled }) =>
    disabled ? Colors.grayMedium : "transparent"};
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
  border: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: ${Colors.greenLight};
    background-color: ${({ disabled }) =>
      disabled ? Colors.grayMedium : "transparent"};
  }
`;

/**
 * Button text styling
 * Adapts to button state and type
 */
const ButtonText = styled.span<{ disabled?: boolean; transparent?: boolean }>`
  font-family: "Univers55", sans-serif;
  color: ${({ disabled, transparent }) => {
    if (disabled) return Colors.grayLight;
    if (transparent) return Colors.white;
    return Colors.greenDark;
  }};
  font-size: 16px;
  text-transform: uppercase;
  font-weight: 300;
  line-height: 20px;
`;

/**
 * Navigation icon styling
 */
const NavIcon = styled.img`
  aspect-ratio: 1;
  width: 45px;
`;

/**
 * Navigation button wrapper styling
 */
const NavWrapper = styled.button<{ top?: number; left?: number }>`
  top: ${({ top }) => top || 66}px;
  left: ${({ left }) => left || 0}px;
  border: transparent;
  background: transparent;
  cursor: pointer;
  z-index: 1;
  height: 45px;
  position: absolute;
`;

/**
 * Button icon styling
 */
const ButtonIcon = styled.img<{ size?: number }>`
  aspect-ratio: 1;
  width: ${({ size }) => size || 30}px;
`;

/**
 * Icon button wrapper styling
 */
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

  user-select: none;
  -webkit-user-select: none;
`;

/**
 * Dot button styling components
 */
const DotWrapper = styled.div<ButtonProps>`
  width: 80px;
  height: 70px;
  position: relative;
  background-color: transparent;
  z-index: 0;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  align-content: center;
`;

const Dot = styled.div<ButtonProps>`
  width: 20px;
  height: 20px;
  position: absolute;
  left: ${(props) => (props.$isActive ? 70 : 0)}px;
  background: ${Colors.greenLight};
  border-radius: 45px;
  z-index: 1;
  transition: left 0.3s ease-in-out;
`;

const Square = styled.div`
  width: 70px;
  height: 70px;
  left: 10px;
  position: absolute;
  background: ${Colors.darkOpaque};
  ${blur('5px')}
  z-index: 2;
  border: 0.5px solid ${Colors.greenLightOpaque};
`;

const DotIcon = styled.img<ButtonProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ width }) => `${width ?? 24}px`};
  object-fit: contain;
  z-index: 3;
`;

export {
  Button,
  TransparentButton,
  BackButton,
  ForwardButton,
  IconButton,
  EditButton,
  SaveButton,
  CancelButton,
  CloseButton,
  DotButton,
};

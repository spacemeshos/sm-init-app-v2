import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { Button } from "./button";

// Styled component for the menu container
const MenuContainer = styled.div<{
  width?: number;
  top?: number;
  menuBorderColor?: string;
  backgroundColor?: string;
  $isHovered: boolean;
}>`
  width: ${({ $isHovered }) => ($isHovered ? "500px" : "300px")};
  top: ${({ top }) => top || 100}px;
  position: relative;
  padding: 25px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 50px;
  border: 1px solid
    ${({ menuBorderColor }) => menuBorderColor || Colors.greenDark};
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "transparent"};
`;

// Styled component for the menu item/title
const MenuTitle = styled.span`
  cursor: pointer;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 4px;
`;

// Styled component for the container holding the buttons
const ButtonsContainer = styled.div<{ $isHovered: boolean }>`
  transition: max-height 0.5s ease, opacity 0.5s ease;
  max-height: ${({ $isHovered }) => ($isHovered ? "500px" : "0px")};
  opacity: ${({ $isHovered }) => ($isHovered ? "1" : "0")};
  overflow: hidden;
  padding-bottom: ${({ $isHovered }) => ($isHovered ? "20px" : "0px")};
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-content: center;
  align-items: center;
  position: relative;
`;

// Styled component for the icon image
const Icon = styled.img<{ $isHovered: boolean }>`
  aspect-ratio: 1;
  object-fit: contain;
  width: 30px;
  position: relative;
  padding-right: 30px;
`;

//Buttons properties
interface ButtonProps {
  label: string;
  onClick: () => void;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
}

// Interface for the HoverAccordionMenu component properties
interface HoverAccordionMenuProps {
  title: string;
  buttons: ButtonProps[];
  imageSrc?: string;
  height?: number;
  width?: number;
  menuBorderColor?: string;
  buttonsBorderColor?: string;
  backgroundColor?: string;
  top?: number;
  $isHovered: boolean;
}

// HoverAccordionMenu component
export const HoverAccordionMenu: React.FC<
  HoverAccordionMenuProps & {
    $isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }
> = ({
  title,
  imageSrc,
  buttons,
  $isHovered,
  onMouseEnter,
  onMouseLeave,
  width,
  top,
  menuBorderColor,
  buttonsBorderColor,
  backgroundColor,
}) => {
  return (
    <>
      <MenuContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        width={width}
        menuBorderColor={menuBorderColor}
        backgroundColor={backgroundColor}
        top={top}
        $isHovered={$isHovered}
      >
        <MenuTitle>
          {imageSrc && <Icon $isHovered={$isHovered} src={imageSrc} />}
          {title}
        </MenuTitle>
        <ButtonsContainer $isHovered={$isHovered}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              label={button.label}
              buttonTop={20}
              buttonLeft={button.left}
              height={60}
              width={160}
              borderColor={buttonsBorderColor}
            ></Button>
          ))}
        </ButtonsContainer>
      </MenuContainer>
      {/* Container for buttons that appear on hover */}
    </>
  );
};

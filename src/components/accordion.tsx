import React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { Button } from "./button";

// Styled component for the menu container
const MenuContainer = styled.div`
  width: 600px;
  padding: 30px;
  margin-bottom: 45px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid ${Colors.greenDark};
  background-color: ${Colors.darkerGreen};
`;

// Styled component for the menu item/title
const MenuTitle = styled.div`
  cursor: pointer;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 21px;
  font-weight: 100;
  letter-spacing: 4px;
`;

// Styled component for the container holding the buttons
const ButtonsContainer = styled.div<{ $isHovered: boolean }>`
  transition: max-height 0.5s ease, opacity 0.5s ease;
  max-height: ${({ $isHovered }) => ($isHovered ? "200px" : "0px")};
  opacity: ${({ $isHovered }) => ($isHovered ? "1" : "0")};
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  position: relative;
`;

// Styled component for the icon image
const Icon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 30px;
  position: absolute;
  left: 50px;
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
}

// HoverAccordionMenu component
export const HoverAccordionMenu: React.FC<
  HoverAccordionMenuProps & {
    $isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }
> = ({ title, imageSrc, buttons, $isHovered, onMouseEnter, onMouseLeave }) => {
  return (
    <MenuContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Menu title with optional icon */}
      <MenuTitle>
        {imageSrc && <Icon src={imageSrc} alt="" />}
        {title}
      </MenuTitle>
      {/* Container for buttons that appear on hover */}
      <ButtonsContainer $isHovered={$isHovered}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            onClick={button.onClick}
            label={button.label}
            top={40}
            left={button.left}
            height={60}
            width={button.width}
          ></Button>
        ))}
      </ButtonsContainer>
    </MenuContainer>
  );
};

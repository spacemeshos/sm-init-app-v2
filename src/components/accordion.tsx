import React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";

import { Button, TransparentButton } from "./button";

// Styled component for the menu container
const MenuContainer = styled.div<{
  width?: number;
  backgroundColor?: string;
  $isHovered: boolean;
}>`
  width: ${({ width }) => `${width ?? 100}%`};
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "transparent"};
`;

// Styled component for the menu item/title
const MenuTitle = styled.span<{ $isHovered: boolean }>`
  cursor: pointer;
  ${({ $isHovered }) => ($isHovered ? "transparent" : Colors.greenDark)};
`;

// Styled component for the container holding the buttons
const ButtonsContainer = styled.div<{ $isHovered: boolean }>`
  transition: height 0.1s ease, opacity 0.1s ease;
  height: ${({ $isHovered }) => ($isHovered ? "60px" : "0px")};
  opacity: ${({ $isHovered }) => ($isHovered ? "1" : "0")};
  overflow: hidden;
  top: ${({ $isHovered }) => ($isHovered ? "60px" : "0px")};
  padding-bottom: ${({ $isHovered }) => ($isHovered ? "20px" : "0px")};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: absolute;
`;

// Buttons properties
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
  backgroundColor?: string;
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
  buttons,
  $isHovered,
  onMouseEnter,
  onMouseLeave,
  width,
  backgroundColor,
}) => {
  return (
    <>
      <MenuContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        width={width}
        backgroundColor={backgroundColor}
        $isHovered={$isHovered}
      >
        <MenuTitle $isHovered={$isHovered}>
          <Button label={title} />
        </MenuTitle>
          <ButtonsContainer $isHovered={$isHovered}>
            {buttons.map((button, index) => (
              <TransparentButton
                key={index}
                onClick={button.onClick}
                label={button.label}
                top={20}
                left={button.left}
                margin={0}
                height={50}
                width={190}
              ></TransparentButton>
            ))}
          </ButtonsContainer>
      </MenuContainer>
    </>
  );
};

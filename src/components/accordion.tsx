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
  width: auto;
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
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "transparent"};
`;

// Styled component for the menu item/title
const MenuTitle = styled.span<{ $isHovered: boolean }>`
  cursor: pointer;
  ${({ $isHovered }) => ($isHovered ? "transparent" : Colors.greenDark)};
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
        <ButtonsWrapper>
          <ButtonsContainer $isHovered={$isHovered}>
            {buttons.map((button, index) => (
              <TransparentButton
                key={index}
                onClick={button.onClick}
                label={button.label}
                top={20}
                left={button.left}
                margin={5}
                height={60}
                width={180}
              ></TransparentButton>
            ))}
          </ButtonsContainer>
        </ButtonsWrapper>
      </MenuContainer>
    </>
  );
};

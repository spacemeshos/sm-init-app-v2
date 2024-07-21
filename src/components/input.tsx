import * as React from "react";
import Colors from "../styles/colors";
import styled from "styled-components";

interface CustomNumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  inputColor?: string;
  buttonColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  buttonHoverColor?: string;
  fontSize?: number;
  height?: number;
  width?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const StyledInputRoot = styled.div<{ height?: number; width?: number }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  position: absolute;
  height: ${({ height = 100 }) => height}px;
  width: ${({ width = 500 }) => width}px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledInput = styled.input<{
  inputColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  fontSize?: number;
}>`
  font-size: ${({ fontSize = 36 }) => fontSize}px;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 200;
  color: ${({ inputColor = Colors.grayLight }) => inputColor};
  height: ${({ height = 100 }) => height}px;
  width: ${({ width = 200 }) => width}px;
  background: ${({ backgroundColor = Colors.background }) => backgroundColor};
  border: 2px solid ${({ borderColor = Colors.darkerPurple }) => borderColor};
  margin: 0 8px;
  padding: 0px 12px;
  min-width: 130px;
  text-align: center;

  /* Hide default number input arrows buttons */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    border-color: ${({ hoverBorderColor = Colors.purpleDark }) =>
      hoverBorderColor};
  }
  &:focus-visible {
    outline: 0;
  }
`;

const StyledButton = styled.button<{
  buttonColor?: string;
  height?: number;
  width?: number;
}>`
  font-family: "Source Code Pro", sans-serif;
  font-size: 36px;
  box-sizing: border-box;
  line-height: 1.5;
  border: none;
  background: ${({ buttonColor = Colors.purpleDark }) => buttonColor};
  color: ${Colors.grayLight};
  height: ${({ height = 100 }) => height}px;
  width: ${({ width = 70 }) => width}px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const Text = styled.h1`
  color: ${Colors.grayLight};
  font-family: "Source Code Pro", sans-serif;
  text-align: center;
  font-size: 26px;
  position: relative;
`;

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  min = 1,
  max = 99,
  step = 1,
  inputColor,
  buttonColor,
  backgroundColor,
  borderColor,
  hoverBorderColor,
  height,
  width,
  value = min,
  fontSize,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<number>(value);

  const handleIncrement = () => {
    if (inputValue < max) {
      const newValue = inputValue + step;
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = inputValue - step;
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <StyledInputRoot height={height} width={width}>
      <StyledButton
        buttonColor={buttonColor}
        height={height}
        width={width}
        onClick={handleDecrement}
        className="decrement"
      >
        <Text>-</Text>
      </StyledButton>
      <StyledInput
        type="number"
        inputColor={inputColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        hoverBorderColor={hoverBorderColor}
        height={height}
        width={width}
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
        fontSize={fontSize}
      />
      <StyledButton
        buttonColor={buttonColor}
        height={height}
        width={width}
        onClick={handleIncrement}
        className="increment"
      >
        <Text>+</Text>
      </StyledButton>
    </StyledInputRoot>
  );
};

export default CustomNumberInput;

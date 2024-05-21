import * as React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Colors from "../styles/colors";
import styled from "styled-components";

interface CustomNumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  incrementOrder?: number;
  inputColor?: string;
  buttonColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  buttonHoverColor?: string;
  size?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const StyledInputRoot = styled.div<{ inputColor: string; size: number }>`
  font-family: "Source Code Pro", sans-serif;
  font-weight: 400;
  color: ${(props) => props.inputColor};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  height: ${(props) => props.size}px;
`;

const StyledInput = styled.input<{
  inputColor: string;
  size: number;
  backgroundColor: string;
  borderColor: string;
  hoverBorderColor: string;
}>`
  font-size: 15px;
  font-family: "Source Code Pro", sans-serif;
  font-weight: 400;
  height: ${(props) => props.size}px;
  color: ${(props) => props.inputColor};
  background: ${(props) => props.backgroundColor};
  border: 2px solid ${(props) => props.borderColor};
  margin: 0 8px;
  padding: 0px 12px;
  min-width: 130px;
  text-align: center;

  &:hover {
    border-color: ${(props) => props.hoverBorderColor};
  }

  &:focus {
    border-color: ${(props) => props.hoverBorderColor};
  }

  &:focus-visible {
    outline: 0;
  }
`;

const StyledButton = styled.button<{
  buttonColor: string;
  buttonHoverColor: string;
  size: number;
  borderColor: string;
  incrementOrder: number;
}>`
  font-family: "Source Code Pro", sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-color: ${(props) => props.borderColor};
  background: ${(props) => props.buttonColor};
  color: ${(props) => props.buttonHoverColor};
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${(props) => props.buttonColor};
    color: ${(props) => props.buttonHoverColor};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: ${(props) => props.incrementOrder};
  }
`;

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  min = 1,
  max = 99,
  step = 1,
  incrementOrder = 1,
  inputColor = Colors.grayLight,
  buttonColor = Colors.purpleDark,
  backgroundColor = Colors.background,
  borderColor = Colors.darkerPurple,
  hoverBorderColor = Colors.purpleDark,
  buttonHoverColor = Colors.grayLight,
  size = 50,
  value = min,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<number>(value);

  const handleIncrement = () => {
    if (inputValue < max) {
      const newValue = inputValue + step;
      setInputValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = inputValue - step;
      setInputValue(newValue);
      onChange && onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setInputValue(newValue);
      onChange && onChange(newValue);
    }
  };

  return (
    <StyledInputRoot inputColor={inputColor} size={size}>
      <StyledButton
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
        size={size}
        borderColor={borderColor}
        onClick={handleDecrement}
        className={`decrement`}
        incrementOrder={incrementOrder}
      >
        <RemoveIcon fontSize="small" />
      </StyledButton>
      <StyledInput
        type="number"
        inputColor={inputColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        hoverBorderColor={hoverBorderColor}
        size={size}
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
      />
      <StyledButton
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
        size={size}
        borderColor={borderColor}
        onClick={handleIncrement}
        className={`increment`}
        incrementOrder={incrementOrder}
      >
        <AddIcon fontSize="small" />
      </StyledButton>
    </StyledInputRoot>
  );
};

export default CustomNumberInput;

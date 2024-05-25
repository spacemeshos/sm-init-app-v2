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
  fontsize?: number;
  height?: number;
  width?: number;
  value?: number;
  onChange?: (value: number) => void;
}

const StyledInputRoot = styled.div<{ inputColor: string; height: number; width: number }>`
  font-family: "Source Code Pro", sans-serif;
  font-weight: 400;
  color: ${(props) => props.inputColor};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;`;

const StyledInput = styled.input<{
  inputColor: string;
  height: number;
  width: number;
  backgroundColor: string;
  borderColor: string;
  hoverBorderColor: string;
  fontsize: number;
}>`
  font-size: ${(props) => props.fontsize}px;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 200;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  color: ${(props) => props.inputColor};
  background: ${(props) => props.backgroundColor};
  border: 2px solid ${(props) => props.borderColor};
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
  height : number;
  width : number;
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
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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
  height = 50,
  width = 50,
  value = min,
  fontsize = 16,
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
    <StyledInputRoot inputColor={inputColor} height={height} width={width}>
      <StyledButton
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
        height={height}
        width={width}
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
        height={height}
        width={width}
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
        fontsize={fontsize}
      />
      <StyledButton
        buttonColor={buttonColor}
        buttonHoverColor={buttonHoverColor}
        height={height}
        width={width}
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

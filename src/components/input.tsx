import * as React from "react";
import styled from "styled-components";

import Colors from "../styles/colors";

interface CustomNumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  inputColor?: string;
  buttonColor?: string;
  fontSize?: number;
  height?: number;
  width?: number;
  value?: number;
  onChange?: (value: number) => void;
}

interface HexInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontSize?: number;
  height?: number;
  width?: number;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  type?: string;
}

const StyledInputRoot = styled.div<{ height?: number; width?: number }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  position: absolute;
  height: 100px;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledInput = styled.input<{
  fontSize?: number;
  isValid?: boolean;
}>`
  font-size: ${({ fontSize = 36 }) => fontSize}px;
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 200;
  color: ${Colors.white};
  height: 40px;
  width: 300px;
  background: ${Colors.greenLightOpaque};
  border: 2px solid ${props => props.isValid === false ? Colors.red : Colors.whiteOpaque};
  padding: 5px;
  text-align: center;

  /* Hide default number input arrows buttons */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &.error {
    border-color: ${Colors.red};
  }
`;

const StyledButton = styled.button<{
  height?: number;
  width?: number;
}>`
  font-family: "Source Code Pro", sans-serif;
  font-size: 36px;
  box-sizing: border-box;
  line-height: 1.5;
  border: none;
  background: ${Colors.whiteOpaque};
  color: ${Colors.white};
  height: 40px;
  width: 56px;
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

const HexInput: React.FC<HexInputProps> = ({
  value = '',
  onChange,
  fontSize,
  height,
  width,
  placeholder,
  maxLength,
  className,
  type = 'text'
}) => {
  return (
    <StyledInputRoot height={height} width={width}>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        fontSize={fontSize}
        className={className}
      />
    </StyledInputRoot>
  );
};

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  min = 1,
  max = 99,
  step = 1,
  height,
  width,
  value = min,
  fontSize,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<number>(value);

  // Add effect to sync external value with internal state
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

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
        height={height}
        width={width}
        onClick={handleDecrement}
        className="decrement"
      >
        <Text>-</Text>
      </StyledButton>
      <StyledInput
        type="number"
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
        fontSize={fontSize}
      />
      <StyledButton
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

export { CustomNumberInput as default, HexInput };

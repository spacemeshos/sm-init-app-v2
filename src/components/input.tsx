import * as React from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import plusIcon from "../assets/plus.png";
import minusIcon from "../assets/minus.png";

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

const StyledInputRoot = styled.div<{ height?: number }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  position: absolute;
  height: 50px;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledInput = styled.input<{
  isValid?: boolean;
}>`
  font-size: 28px;
  font-family: "Univers45", sans-serif;
  font-weight: 200;
  color: ${Colors.white};
  height: 45px;
  line-height: 50px;
  width: 100px;
  background-color: ${Colors.greenLightOpaque};
  border: 1px solid
    ${(props) => (props.isValid === false ? Colors.red : "transparent")};
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

const StyledButton = styled.button`
  border: none;
  background-color: ${Colors.greenLightOpaque};
  height: 45px;
  width: 45px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const HexInput: React.FC<HexInputProps> = ({
  value = '',
  onChange,
  height,
  width,
  placeholder,
  maxLength,
  className,
  type = 'text'
}) => {
  return (
    <StyledInputRoot height={height}>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        width={width}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
      />
    </StyledInputRoot>
  );
};

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  min = 1,
  max,
  step = 1,
  height,
  value = min,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<number>(value);

  // Add effect to sync external value with internal state
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleIncrement = () => {
    if (max === undefined || inputValue < max) {
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
    if (
      !isNaN(newValue) &&
      newValue >= min &&
      (max === undefined || newValue <= max)
    ) {
      setInputValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <StyledInputRoot height={height}>
      <StyledButton
        onClick={handleDecrement}
        className="decrement"
      >
        <IconImage src={minusIcon} alt="Decrease" />
      </StyledButton>
      <StyledInput
        type="number"
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
      />
      <StyledButton
        onClick={handleIncrement}
        className="increment"
      >
        <IconImage src={plusIcon} alt="Increase" />
      </StyledButton>
    </StyledInputRoot>
  );
};

export { CustomNumberInput as default, HexInput };

import * as React from 'react';
import styled from 'styled-components';

import minusIcon from '../assets/minus.png';
import plusIcon from '../assets/plus.png';
import Colors from '../styles/colors';

interface CustomNumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
  isValid?: boolean;
}

interface HexInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  fontSize?: number;
  height?: number;
  width?: number;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  type?: string;
  disabled?: boolean;
}

const StyledInputRoot = styled.div<{ height?: number; width?: number }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  height: ${({ height }) => height || 50}px;
  width: ${({ width }) => width || '100%'};
`;

const StyledInput = styled.input<{
  isValid?: boolean;
  width?: number;
  fontSize?: number;
  height?: number;
}>`
  font-size: ${({ fontSize }) => fontSize || 28}px;
  font-family: 'Univers45', sans-serif;
  font-weight: 200;
  color: ${Colors.white};
  height: ${({ height }) => height || 45}px;
  line-height: 50px;
  width: ${({ width }) => width || 100}px;
  background-color: ${Colors.greenLightOpaque};
  border: 1px solid
    ${(props) => (props.isValid === false ? Colors.red : 'transparent')};
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

  user-select: none;
  -webkit-user-select: none;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const HexInput: React.FC<HexInputProps> = ({
  value = '',
  onChange,
  onBlur,
  height,
  width,
  placeholder,
  maxLength,
  className,
  type = 'text',
  fontSize,
  disabled = false,
}) => {
  return (
    <StyledInputRoot height={height}>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        width={width}
        placeholder={placeholder}
        maxLength={maxLength}
        className={className}
        fontSize={fontSize}
        readOnly={disabled}
      />
    </StyledInputRoot>
  );
};

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  min = 1,
  max,
  step = 1,
  value = min,
  onChange,
  width,
  height,
  fontSize,
  className,
  isValid,
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
    const rawValue = parseInt(e.target.value, 10);
    
    if (!isNaN(rawValue)) {
      // Round to the nearest step multiple if needed
      let newValue = rawValue;
      if (step > 1) {
        const remainder = rawValue % step;
        if (remainder !== 0) {
          // Round to nearest multiple of step
          // If remainder is less than half of step, round down, otherwise round up
          newValue = remainder < (step / 2) 
            ? rawValue - remainder 
            : rawValue + (step - remainder);
        }
      }
      
      // Check if the rounded value is within bounds
      if (
        newValue >= min &&
        (max === undefined || newValue <= max)
      ) {
        setInputValue(newValue);
        onChange?.(newValue);
      }
    }
  };

  return (
    <StyledInputRoot width={width} height={height}>
      <StyledButton onClick={handleDecrement} className="decrement" style={{ height: height || 45 }}>
        <IconImage src={minusIcon} alt="Decrease" />
      </StyledButton>
      <StyledInput
        type="number"
        value={inputValue}
        onChange={handleChange}
        min={min}
        max={max}
        width={width}
        height={height}
        fontSize={fontSize}
        className={className}
        isValid={isValid}
      />
      <StyledButton onClick={handleIncrement} className="increment" style={{ height: height || 45 }}>
        <IconImage src={plusIcon} alt="Increase" />
      </StyledButton>
    </StyledInputRoot>
  );
};

export { CustomNumberInput as default, HexInput };

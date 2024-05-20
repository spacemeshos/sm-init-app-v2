import * as React from "react";
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Colors from "../styles/colors";

const NumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInput,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: <AddIcon fontSize="small" />,
          className: "increment",
        },
        decrementButton: {
          children: <RemoveIcon fontSize="small" />,
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function QuantityInput() {
  return <NumberInput aria-label="Quantity Input" min={1} max={99} />;
}

const StyledInputRoot = styled("div")`
  font-family: "Source Code Pro", sans-serif;
  font-weight: 400;
  color: ${Colors.grayLight};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: auto;
  height: 45px;
`;

const StyledInput = styled("input")`
  font-size: 15px;
  font-family: "Source Code Pro", sans-serif;
  font-weight: 400;
  height: 50px;
  color: ${Colors.grayLight};
  background: ${Colors.background};
  border: 2px solid ${Colors.darkerPurple};
  margin: 0 8px;
  padding: 0px 12px;
  min-width: 130px;
  text-align: center;

  &:hover {
    border-color: ${Colors.purpleDark};
  }

  &:focus {
    border-color: ${Colors.purpleDark};
  }

  &:focus-visible {
    outline: 0;
  }
`;

const StyledButton = styled("button")`
  font-family: "Source Code Pro", sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-color: ${Colors.purpleDark};
  background: ${Colors.purpleDark};
  color: ${Colors.purpleLight};
  width: 50px;
  height: 50px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${Colors.purpleDark};
    color: ${Colors.grayLight};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`;

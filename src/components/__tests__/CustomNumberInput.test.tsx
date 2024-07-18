import "@testing-library/jest-dom";
import CustomNumberInput from "../input";
import { render, fireEvent } from "@testing-library/react";

describe("CustomNumberInput Component", () => {
  test("renders correctly with default props", () => {
    const { getByRole } = render(<CustomNumberInput onChange={jest.fn()} />);
    expect(getByRole("spinbutton")).toHaveValue(1);
  });

  test("renders correctly with custom props", () => {
    const { getByRole } = render(
      <CustomNumberInput
        min={10}
        max={50}
        step={5}
        value={20}
        onChange={jest.fn()}
      />
    );
    expect(getByRole("spinbutton")).toHaveValue(20);
  });

  test("increments value correctly", () => {
    const handleChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomNumberInput onChange={handleChange} />
    );
    const incrementButton = getByText("+");
    const input = getByRole("spinbutton");

    fireEvent.click(incrementButton);
    expect(input).toHaveValue(2);
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test("decrements value correctly", () => {
    const handleChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomNumberInput value={2} onChange={handleChange} />
    );
    const decrementButton = getByText("-");
    const input = getByRole("spinbutton");

    fireEvent.click(decrementButton);
    expect(input).toHaveValue(1);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test("does not decrement below min", () => {
    const handleChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomNumberInput min={1} value={1} onChange={handleChange} />
    );
    const decrementButton = getByText("-");
    const input = getByRole("spinbutton");

    fireEvent.click(decrementButton);
    expect(input).toHaveValue(1);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test("does not increment above max", () => {
    const handleChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomNumberInput max={5} value={5} onChange={handleChange} />
    );
    const incrementButton = getByText("+");
    const input = getByRole("spinbutton");

    fireEvent.click(incrementButton);
    expect(input).toHaveValue(5);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test("changes value correctly when input is changed", () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<CustomNumberInput onChange={handleChange} />);
    const input = getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "10" } });
    expect(input).toHaveValue(10);
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  test("does not change value if input is out of bounds", () => {
    const handleChange = jest.fn();
    const { getByRole } = render(
      <CustomNumberInput min={1} max={10} value={5} onChange={handleChange} />
    );
    const input = getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "15" } });
    expect(input).toHaveValue(5);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

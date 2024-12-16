import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectIdentity } from '../SelectIdentity';
import { Settings } from '../../../state/SettingsContext';

// Mock the useSettings hook
const mockSetSettings = jest.fn();
jest.mock('../../../state/SettingsContext', () => ({
  useSettings: () => ({
    settings: {} as Settings,
    setSettings: mockSetSettings,
  }),
}));

describe('SelectIdentity', () => {
  beforeEach(() => {
    mockSetSettings.mockClear();
  });

  it('renders the component with initial empty state', () => {
    render(<SelectIdentity />);
    
    // Check if main elements are rendered
    expect(screen.getByText('Enter your Smesher Identity')).toBeInTheDocument();
    expect(screen.getByText('Public Key in hex')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Public Key (hex, optional)')).toBeInTheDocument();
    expect(screen.getByText('If no Identity provided, a new one will be created automatically')).toBeInTheDocument();
  });

  it('handles valid public key input', () => {
    render(<SelectIdentity />);
    const input = screen.getByPlaceholderText('Enter your Public Key (hex, optional)');
    const validHex = 'a'.repeat(64);

    fireEvent.change(input, { target: { value: validHex } });

    // Check if settings were updated
    expect(mockSetSettings).toHaveBeenCalledWith(expect.any(Function));
    // Get the callback function that was passed to setSettings
    const setSettingsCallback = mockSetSettings.mock.calls[0][0];
    // Call the callback with a mock previous state
    const newSettings = setSettingsCallback({});
    // Verify the callback returns the correct new state
    expect(newSettings).toEqual(expect.objectContaining({
      publicKey: validHex
    }));

    // Check if success message is displayed
    expect(screen.getByText(/Custom ID will be used:/)).toBeInTheDocument();
    
    // Check that no error message is displayed
    expect(input.className).not.toContain('error');
  });

  it('handles invalid public key input', () => {
    render(<SelectIdentity />);
    const input = screen.getByPlaceholderText('Enter your Public Key (hex, optional)');
    
    // Test invalid characters
    fireEvent.change(input, { target: { value: 'xyz123' } });
    expect(screen.getByText('Public key must be a 64-character hexadecimal string')).toBeInTheDocument();
    expect(input.className).toContain('error');
    
    // Verify settings update
    expect(mockSetSettings).toHaveBeenCalledWith(expect.any(Function));
    const setSettingsCallback = mockSetSettings.mock.calls[0][0];
    const newSettings = setSettingsCallback({});
    expect(newSettings).toEqual(expect.objectContaining({
      publicKey: undefined
    }));

    // Test invalid length
    fireEvent.change(input, { target: { value: 'abc123' } });
    expect(screen.getByText('Public key must be a 64-character hexadecimal string')).toBeInTheDocument();
    
    // Verify settings update again
    const secondCallback = mockSetSettings.mock.calls[1][0];
    const secondSettings = secondCallback({});
    expect(secondSettings).toEqual(expect.objectContaining({
      publicKey: undefined
    }));
  });

  it('handles empty input', () => {
    render(<SelectIdentity />);
    const input = screen.getByPlaceholderText('Enter your Public Key (hex, optional)');
    
    // First enter some valid input
    const validHex = 'a'.repeat(64);
    fireEvent.change(input, { target: { value: validHex } });
    
    // Then clear it
    fireEvent.change(input, { target: { value: '' } });
    
    // Verify settings update
    const lastCallback = mockSetSettings.mock.calls[mockSetSettings.mock.calls.length - 1][0];
    const finalSettings = lastCallback({});
    expect(finalSettings).toEqual(expect.objectContaining({
      publicKey: undefined
    }));
    
    // Check if default message is displayed
    expect(screen.getByText('If no Identity provided, a new one will be created automatically')).toBeInTheDocument();
    
    // Check that no error is displayed
    expect(input.className).not.toContain('error');
  });

  it('converts input to lowercase', () => {
    render(<SelectIdentity />);
    const input = screen.getByPlaceholderText('Enter your Public Key (hex, optional)');
    const upperHex = 'A'.repeat(64);
    const lowerHex = 'a'.repeat(64);

    fireEvent.change(input, { target: { value: upperHex } });

    // Check if input was converted to lowercase
    expect(input).toHaveValue(lowerHex);
    
    // Verify settings update
    const callback = mockSetSettings.mock.calls[0][0];
    const newSettings = callback({});
    expect(newSettings).toEqual(expect.objectContaining({
      publicKey: lowerHex
    }));
  });

  it('enforces maximum length restriction', () => {
    render(<SelectIdentity />);
    const input = screen.getByPlaceholderText('Enter your Public Key (hex, optional)');
    
    // Try to enter more than 64 characters
    const tooLongHex = 'a'.repeat(65);
    fireEvent.change(input, { target: { value: tooLongHex } });
    
    // Check if input is limited to 64 characters
    expect(input).toHaveAttribute('maxLength', '64');
  });
});

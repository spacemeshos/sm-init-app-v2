import { truncateHex, isValidHex } from '../hexUtils';

describe('truncateHex', () => {
  it('should return empty string for empty input', () => {
    expect(truncateHex('')).toBe('');
  });

  it('should not truncate string shorter than 2 * visibleChars', () => {
    expect(truncateHex('1234')).toBe('1234');
    expect(truncateHex('123456789abc', 6)).toBe('123456789abc');
  });

  it('should truncate string with default visibleChars (6)', () => {
    const longHex = '1234567890abcdef1234567890abcdef';
    expect(truncateHex(longHex)).toBe('123456...abcdef');
  });

  it('should truncate string with custom visibleChars', () => {
    const longHex = '1234567890abcdef1234567890abcdef';
    expect(truncateHex(longHex, 4)).toBe('1234...cdef');
    expect(truncateHex(longHex, 8)).toBe('12345678...90abcdef');
  });
});

describe('isValidHex', () => {
  it('should validate correct hex strings', () => {
    expect(isValidHex('1234567890abcdef')).toBe(true);
    expect(isValidHex('ABCDEF')).toBe(true);
    expect(isValidHex('1a2b3c')).toBe(true);
  });

  it('should validate hex strings with specific length', () => {
    expect(isValidHex('1234', 4)).toBe(true);
    expect(isValidHex('1234', 2)).toBe(false);
    expect(isValidHex('1234', 6)).toBe(false);
    // When length is undefined, should only validate hex characters
    expect(isValidHex('1234')).toBe(true);
    expect(isValidHex('12345g')).toBe(false);
  });

  it('should reject invalid hex characters', () => {
    expect(isValidHex('12345g')).toBe(false);
    expect(isValidHex('abcdeg')).toBe(false);
    expect(isValidHex('xyz')).toBe(false);
  });

  it('should handle special characters and spaces', () => {
    expect(isValidHex('12 34')).toBe(false);
    expect(isValidHex('12-34')).toBe(false);
    expect(isValidHex('12.34')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(isValidHex('')).toBe(false);
  });

  it('should handle case sensitivity', () => {
    expect(isValidHex('abcDEF')).toBe(true);
    expect(isValidHex('ABCDEF123')).toBe(true);
    expect(isValidHex('abcdef123')).toBe(true);
  });

  it('should validate 64-character hex strings (common use case)', () => {
    const valid64Hex = 'a'.repeat(64);
    const invalid65Hex = 'a'.repeat(65);

    expect(isValidHex(valid64Hex, 64)).toBe(true);
    expect(isValidHex(invalid65Hex, 64)).toBe(false);
  });
});

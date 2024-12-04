/**
 * Truncates a hex string by showing only the first and last few characters
 * @param hex The hex string to truncate
 * @param visibleChars Number of characters to show at the start and end (default: 6)
 * @returns Truncated hex string with ellipsis in the middle
 */
export const truncateHex = (hex: string, visibleChars: number = 6): string => {
  if (!hex) return '';
  if (hex.length <= visibleChars * 2) return hex;
  
  const start = hex.slice(0, visibleChars);
  const end = hex.slice(-visibleChars);
  return `${start}...${end}`;
};

/**
 * Validates if a string is a valid hex value
 * @param hex The string to validate
 * @param length Expected length of the hex string (optional)
 * @returns boolean indicating if the string is a valid hex value
 */
export const isValidHex = (hex: string, length?: number): boolean => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(hex)) return false;
  if (length && hex.length !== length) return false;
  return true;
};

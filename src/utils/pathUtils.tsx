/**
 * Utility function to shorten the directory path.
 * @param path - The original directory path.
 * @param maxLength - The maximum length of the shortened path.
 * @returns The shortened path.
 */
export const shortenPath = (path: string, maxLength: number): string => {
  if (path.length <= maxLength) {
    return path;
  }
  const start = path.slice(0, 0); 
  const end = path.slice(maxLength);
  return `${start}...${end}`;
};

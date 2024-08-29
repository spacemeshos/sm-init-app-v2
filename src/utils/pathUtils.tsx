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

  const segments = path.split("/");
  const result = [];

  let currentLength = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Check if adding this segment exceeds the max length
    if (segment.length > 1 && currentLength + segment.length + 3 > maxLength) {
      result.push("...");
      result.push(segments[segments.length - 1]); // Always add the last segment
      break;
    } else {
      result.push(segment);
      currentLength += segment.length + 1; // Adding 1 for the slash
    }
  }

  return result.join("/");
};

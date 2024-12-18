export const calculateTotalSize = (numUnits: number = 4): string => {
  const sizeInGiB = numUnits * 64;

  // Define unit thresholds
  const units = ["GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let size = sizeInGiB;
  let unitIndex = 0;

  // Loop to find the appropriate unit
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Return the size with the corresponding unit
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

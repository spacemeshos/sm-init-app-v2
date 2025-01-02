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

// Constants for max data size calculation
const CYCLE_GAP_HOURS = 12;
const K_SAFE_PERIOD = 0.7;

export const calculateMaxDataSize = (speed: number): number => {
  const cycleGapSeconds = CYCLE_GAP_HOURS * 3600; // Convert hours to seconds
  const gibSize = cycleGapSeconds * K_SAFE_PERIOD * speed;
  return Math.floor(gibSize);
};

export const formatSize = (sizeInGiB: number): string => {
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

export const calculateNumFiles = (
  numUnits: number = 4,
  maxFileSizeMiB: number = 4096
): number => {
  // Convert total size to MiB (numUnits * 64 GiB * 1024 MiB/GiB)
  const totalSizeInMiB = numUnits * 0.00006103515625 * 1024; //TESTING PURPOSES TO BE REVERTED TO 64
  return Math.ceil(totalSizeInMiB / maxFileSizeMiB);
};

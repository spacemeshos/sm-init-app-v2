import { SizeConstants } from "../Shared/Constants";

export const calculateTotalSize = (numUnits: number = SizeConstants.DEFAULT_NUM_UNITS): string => {
  const sizeInGiB = numUnits * SizeConstants.UNIT_SIZE_GIB;
  let size = sizeInGiB;
  let unitIndex = 0;

  // Loop to find the appropriate unit
  while (size >= 1024 && unitIndex < SizeConstants.SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Return the size with the corresponding unit
  return `${size.toFixed(1)} ${SizeConstants.SIZE_UNITS[unitIndex]}`;
};

export const calculateMaxDataSize = (speed: number): number => {
  const cycleGapSeconds = SizeConstants.CYCLE_GAP_HOURS * 3600; // Convert hours to seconds
  const gibSize = cycleGapSeconds * SizeConstants.K_SAFE_PERIOD * speed;
  return Math.floor(gibSize);
};

export const formatSize = (sizeInGiB: number): string => {
  let size = sizeInGiB;
  let unitIndex = 0;

  // Loop to find the appropriate unit
  while (size >= 1024 && unitIndex < SizeConstants.SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Return the size with the corresponding unit
  return `${size.toFixed(1)} ${SizeConstants.SIZE_UNITS[unitIndex]}`;
};

export const calculateNumFiles = (
  numUnits: number = SizeConstants.DEFAULT_NUM_UNITS,
  maxFileSizeMiB: number = SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
): number => {
  // Convert total size to MiB (numUnits * UNIT_SIZE_GiB * 1024 MiB/GiB)
  const totalSizeInMiB = numUnits * SizeConstants.UNIT_SIZE_GIB * 1024;
  return Math.ceil(totalSizeInMiB / maxFileSizeMiB);
};

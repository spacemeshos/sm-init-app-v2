/**
 * @fileoverview Utility functions for size calculations and formatting in the POS system.
 * These functions handle conversions between different size units (GiB, TiB, etc.)
 * and calculate storage requirements based on system parameters.
 */

import { SizeConstants } from "../Shared/Constants";

/**
 * Calculates the size of a single unit in bytes based on the number of labels per unit
 * @param {number} labelsPerUnit - Number of labels per unit (defaults to DEFAULT_LABELS_PER_UNIT)
 * @returns {number} Size of a single unit in bytes
 */
export const getSizePerUnit = (labelsPerUnit: number): number =>
  labelsPerUnit * SizeConstants.BITS_PER_LABEL / 8;

export const formatSizeUnits = (size: number) => {
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < SizeConstants.SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  // Return the size with the corresponding unit
  return `${size.toFixed(1)} ${SizeConstants.SIZE_UNITS[unitIndex]}`;
};

/**
 * Calculates the total size based on the number of units
 * @param {number} numUnits - Number of units to calculate size for (defaults to DEFAULT_NUM_UNITS)
 * @returns {string} Formatted string with size and appropriate unit (e.g., "1.5 TiB")
 */
export const calculateTotalSize = (numUnits: number = SizeConstants.DEFAULT_NUM_UNITS): string => {
  const sizeInBytes = getSizePerUnit(SizeConstants.DEFAULT_LABELS_PER_UNIT) * numUnits;
  return formatSizeUnits(sizeInBytes);
};

/**
 * Calculates the maximum data size that can be processed based on speed
 * Uses cycle gap hours and safety period for calculation
 * @param {number} speed - Processing speed in GiB/s
 * @returns {number} Maximum size in bytes that can be processed within constraints
 */
export const calculateMaxDataSize = (speed: number): number => {
  const cycleGapSeconds = SizeConstants.CYCLE_GAP_HOURS * 3600; // Convert hours to seconds
  const speedBytes = speed * 1024 * 1024 * 1024; // Convert GiB/s to bytes/s
  const maxSize = speedBytes * cycleGapSeconds; // Maximum size in bytes
  const maxSafeSize = maxSize * SizeConstants.K_SAFE_PERIOD;
  return Math.floor(maxSafeSize);
};

/**
 * Formats a size in GiB to a human-readable string with appropriate unit
 * Automatically scales to larger units (TiB, PiB) when size is large enough
 * @param {number} sizeInGiB - Size in GiB to format
 * @returns {string} Formatted string with size and unit (e.g., "2.5 TiB")
 */
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

/**
 * Calculates the number of files needed based on total size and max file size
 * Used to split large datasets into manageable chunks
 * @param {number} numUnits - Number of units to calculate for (defaults to DEFAULT_NUM_UNITS)
 * @param {number} maxFileSizeMiB - Maximum size per file in MiB (defaults to DEFAULT_MAX_FILE_SIZE_MIB)
 * @returns {number} Number of files needed to store the total data
 */
export const calculateNumFiles = (
  numUnits: number = SizeConstants.DEFAULT_NUM_UNITS,
  maxFileSizeMiB: number = SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB
): number => {
  // Convert total size to MiB (numUnits * UNIT_SIZE_GiB * 1024 MiB/GiB)
  const totalSizeInB = getSizePerUnit(SizeConstants.DEFAULT_LABELS_PER_UNIT) * numUnits;
  const totalSizeInMiB = totalSizeInB / 1024 / 1024;
  return Math.ceil(totalSizeInMiB / maxFileSizeMiB);
};

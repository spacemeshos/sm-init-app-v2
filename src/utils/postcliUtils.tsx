import { SizeConstants } from "../Shared/Constants";
import { Settings } from "../state/SettingsContext";

import { isValidHex } from "./hexUtils";

const MIB_TO_BYTES = 1048576; // 1 MiB = 1,048,576 bytes

export const buildPostCliArgs = (settings: Settings): string[] | null => {
  // If ATX ID is being fetched from API, wait for it
  if (!settings.atxId && settings.atxIdSource === 'api') {
    return null; // Return null to indicate postcli should wait
  }

  // For manual input, require valid ATX ID
  if (settings.atxIdSource === 'manual' && (!settings.atxId || !isValidHex(settings.atxId, 64))) {
    return null;
  }

  // If we have an ATX ID error, don't proceed
  if (settings.atxIdError) {
    return null;
  }

  const args: string[] = [];

  // Required arguments
  args.push(`-provider=${settings.provider || 0}`);
  args.push(`-numUnits=${settings.numUnits || SizeConstants.DEFAULT_NUM_UNITS}`);
  args.push(`-commitmentAtxId=${settings.atxId}`); // ATX ID is required

  // Optional identity - only pass -id flag if publicKey is provided and valid
  if (settings.publicKey && isValidHex(settings.publicKey, 64)) {
    args.push(`-id=${settings.publicKey}`);
  }

  // Directory - only add if custom directory is provided
  if (settings.selectedDir && settings.selectedDir.trim() !== "") {
    args.push(`-datadir=${settings.selectedDir}`);
  }

  // Add maxFileSize if provided, converting from MiB to bytes
  if (settings.maxFileSize) {
    const maxFileSizeBytes = settings.maxFileSize * MIB_TO_BYTES;
    args.push(`-maxFileSize=${maxFileSizeBytes}`);
  }

  // Add debug log level
  //args.push("-logLevel=debug");

  // Temporary flag for quicker testing
  args.push("-labelsPerUnit=4096");
  args.push("-yes");

  // Always add genproof
  //args.push("-genproof");

  return args;
};

export const validateSettings = (settings: Settings): string | null => {
  // Check for ATX ID error first
  if (settings.atxIdError) {
    return settings.atxIdError;
  }

  // If ATX ID is undefined and source is API, it means it's being fetched
  if (!settings.atxId && settings.atxIdSource === 'api') {
    return "Waiting for ATX ID to be fetched...";
  }

  // If ATX ID is undefined and source is manual, it's an error
  if (!settings.atxId && settings.atxIdSource === 'manual') {
    return "ATX ID is required";
  }

  // Validate ATX ID format if it exists
  if (settings.atxId && !isValidHex(settings.atxId, 64)) {
    return "ATX ID must be a 64-character hexadecimal string";
  }

  if (!settings.numUnits || settings.numUnits < SizeConstants.DEFAULT_NUM_UNITS) {
    return `Number of units must be at least ${SizeConstants.DEFAULT_NUM_UNITS}`;
  }
  if (settings.provider === undefined) {
    return "Provider must be selected";
  }
  // If selectedDir is provided, validate that it's not empty
  if (settings.selectedDir && settings.selectedDir.trim() === "") {
    return "Selected directory cannot be empty";
  }
  // If publicKey is provided, validate that it's a valid hex string
  if (settings.publicKey && !isValidHex(settings.publicKey, 64)) {
    return "Invalid public key format";
  }
  // Validate maxFileSize if provided
  if (
    settings.maxFileSize &&
    (settings.maxFileSize < 1 || settings.maxFileSize > SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB * 2)
  ) {
    return `Max file size must be between 1 and ${SizeConstants.DEFAULT_MAX_FILE_SIZE_MIB * 2} MiB`;
  }
  return null;
};

export const validateDirectory = (path: string): boolean => {
  if (!path) return false;

  // Basic validation - ensure path is not empty and has valid characters
  const validPathRegex = /^[a-zA-Z0-9\s\-_/\\:.]+$/;
  return validPathRegex.test(path);
};

import { Settings } from "../state/SettingsContext";

import { isValidHex } from "./hexUtils";

export const buildPostCliArgs = (settings: Settings): string[] | null => {
  // First validate that ATX ID is present and valid
  if (!settings.atxId || !isValidHex(settings.atxId, 64)) {
    return null; // Return null to indicate postcli should not run
  }

  const args: string[] = [];

  // Required arguments
  args.push(`-provider=${settings.provider || 0}`);
  args.push(`-numUnits=${settings.numUnits || 4}`);
  args.push(`-commitmentAtxId=${settings.atxId}`); // ATX ID is required

  // Optional identity - only pass -id flag if publicKey is provided and valid
  if (settings.publicKey && isValidHex(settings.publicKey, 64)) {
    args.push(`-id=${settings.publicKey}`);
  }

  // Directory - only add if custom directory is provided
  if (settings.selectedDir && settings.selectedDir.trim() !== "") {
    args.push(`-datadir=${settings.selectedDir}`);
  }

  // Always add genproof
  args.push("-genproof");

  return args;
};

export const validateSettings = (settings: Settings): string | null => {
  // ATX ID is required and must be valid
  if (!settings.atxId) {
    return "ATX ID is required";
  }
  if (!isValidHex(settings.atxId, 64)) {
    return "ATX ID must be a 64-character hexadecimal string";
  }

  if (!settings.numUnits || settings.numUnits < 4) {
    return "Number of units must be at least 4";
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
  return null;
};

export const validateDirectory = (path: string): boolean => {
  if (!path) return false;

  // Basic validation - ensure path is not empty and has valid characters
  const validPathRegex = /^[a-zA-Z0-9\s\-_/\\:.]+$/;
  return validPathRegex.test(path);
};

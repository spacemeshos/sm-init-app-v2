/**
 * @fileoverview Service layer for interacting with the postcli binary
 * Provides functionality for executing postcli commands, managing processes,
 * and handling command output in both synchronous and detached modes.
 * 
 * Key Features:
 * - Synchronous command execution with real-time output
 * - Detached process management for long-running operations
 * - Process monitoring and termination
 * - Comprehensive error handling and logging
 * - Console output formatting and management
 */

import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

import { Settings } from '../state/SettingsContext';
import { buildPostCliArgs, validateSettings } from '../utils/postcliUtils';

/**
 * Temporary mock data for ATX ID until API endpoint is available
 * Will be replaced with actual network call to:
 * https://mainnet-api.spacemesh.network/spacemesh.v2alpha1.ActivationService/Highest
 */
const MOCK_ATX_RESPONSE = {
  atxId: '65f77244a23870ee39f15cf088ee1651745c3b73195491e277bc65aa56937425',
};

/**
 * Response structure for postcli command execution
 * @interface PostCliResponse
 */
export interface PostCliResponse {
  stdout: string;
  stderr: string;
  success: boolean;
}

/**
 * Response structure for ATX ID fetch operation
 * @interface AtxIdResponse
 */
export interface AtxIdResponse {
  /** The latest ATX ID from the network */
  atxId: string;
}

/**
 * Response structure for detached process execution
 * @interface DetachedProcessResponse
 */
export interface DetachedProcessResponse {
  /** Process ID of the detached postcli process */
  process_id: number;
  /** Status message about the process */
  message: string;
}

/**
 * Fetches the latest ATX ID from the network
 * Currently returns mock data, will be replaced with actual API call
 * 
 * @returns {Promise<AtxIdResponse>} Latest ATX ID information
 * @todo Implement actual API call when endpoint is available
 */
export const fetchLatestAtxId = async (): Promise<AtxIdResponse> => {
  // TODO: Replace with actual API call when endpoint is available
  // const response = await fetch('https://mainnet-api.spacemesh.network/spacemesh.v2alpha1.ActivationService/Highest');
  // return response.json();

  // Simulate API delay for testing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data
  return MOCK_ATX_RESPONSE;
};

/**
 * Executes postcli command synchronously with the provided settings
 * Performs full validation before execution and provides real-time output
 * 
 * Process:
 * 1. Validates all settings
 * 2. Builds command arguments
 * 3. Executes command and streams output
 * 4. Handles any errors or validation failures
 * 
 * @param {Settings} settings - POS configuration settings
 * @param {Function} updateConsole - Optional callback for console updates
 * @returns {Promise<PostCliResponse>} Command execution results
 * @throws {Error} If settings validation fails or command execution fails
 */
export const executePostCli = async (
  settings: Settings,
  updateConsole?: (command: string, output: string) => void
): Promise<PostCliResponse> => {
  console.log('executePostCli called with settings:', settings);

  // Validate settings before proceeding
  const validationError = validateSettings(settings);
  if (validationError) {
    console.error('Validation error:', validationError);
    if (updateConsole) {
      updateConsole('validate', `Validation Error: ${validationError}`);
    }
    throw new Error(validationError);
  }

  // Build command arguments
  const args = buildPostCliArgs(settings);
  if (!args) {
    const error = 'Cannot proceed: Valid ATX ID is required';
    console.error(error);
    if (updateConsole) {
      updateConsole('validate', `Error: ${error}`);
    }
    throw new Error(error);
  }

  const commandStr = `./postcli ${args.join(' ')}`;

  console.log('Executing command:', commandStr);
  if (updateConsole) {
    updateConsole(commandStr, '> Executing command...');
  }

  try {
    console.log('Invoking Tauri command with args:', args);
    const response = await invoke<{ stdout: string; stderr: string }>(
      'run_postcli_command',
      { args }
    );
    console.log('Command response:', response);

    // Handle stdout output
    if (response.stdout && response.stdout.trim()) {
      console.log('Command stdout:', response.stdout);
      updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
    }

    // Handle stderr output (may contain errors or warnings)
    if (response.stderr && response.stderr.trim()) {
      console.error('Command stderr:', response.stderr);
      updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
    }

    // Handle case where command produces no output
    if (!response.stdout && !response.stderr) {
      console.log('Command completed with no output');
      updateConsole?.(commandStr, '> Command completed with no output');
    }

    return {
      ...response,
      success:
        !response.stderr?.includes('error') &&
        !response.stderr?.includes('Error'),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error executing postcli:', error);
    updateConsole?.(commandStr, `> Error:\n${errorMessage}`);
    throw error;
  }
};

/**
 * Executes postcli command in detached mode for long-running operations
 * Sets up event listeners for progress updates and manages background execution
 * 
 * Features:
 * - Background process execution
 * - Real-time progress updates via events
 * - Automatic cleanup of event listeners
 * - Comprehensive error handling
 * 
 * @param {Settings} settings - POS configuration settings
 * @param {Function} updateConsole - Optional callback for console updates
 * @returns {Promise<DetachedProcessResponse>} Detached process information
 * @throws {Error} If settings validation fails or process start fails
 */
export const executePostCliDetached = async (
  settings: Settings,
  updateConsole?: (command: string, output: string) => void
): Promise<DetachedProcessResponse> => {
  console.log('executePostCliDetached called with settings:', settings);

  // Validate settings before proceeding
  const validationError = validateSettings(settings);
  if (validationError) {
    console.error('Validation error:', validationError);
    if (updateConsole) {
      updateConsole('validate', `Validation Error: ${validationError}`);
    }
    throw new Error(validationError);
  }

  // Build command arguments
  const args = buildPostCliArgs(settings);
  if (!args) {
    const error = 'Cannot proceed: Valid ATX ID is required';
    console.error(error);
    if (updateConsole) {
      updateConsole('validate', `Error: ${error}`);
    }
    throw new Error(error);
  }

  const commandStr = `./postcli ${args.join(' ')} (detached)`;

  console.log('Executing command in detached mode:', commandStr);
  if (updateConsole) {
    updateConsole(
      commandStr,
      '> Starting POS data generation in background...'
    );
  }

  let unlistenCallback: (() => void) | undefined;

  try {
    // Set up event listener for postcli logs
    unlistenCallback = await listen('postcli-log', (event) => {
      if (typeof event.payload === 'string') {
        // Update console if callback provided
        if (updateConsole) {
          updateConsole('postcli-detached', event.payload);
        }

        // Emit custom event for process state updates
        // This allows other components to react to progress updates
        window.dispatchEvent(
          new CustomEvent('postcli-progress', {
            detail: event.payload,
          })
        );
      }
    });

    console.log('Invoking Tauri detached command with args:', args);
    const response = await invoke<DetachedProcessResponse>(
      'run_postcli_detached',
      { args }
    );
    console.log('Detached command response:', response);

    if (updateConsole) {
      updateConsole(commandStr, `> ${response.message}`);
    }

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error executing postcli in detached mode:', error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    if (unlistenCallback) {
      unlistenCallback(); // Clean up listener on error
    }
    throw error;
  }
};

/**
 * Stops a running detached postcli process
 * Attempts graceful shutdown of the specified process
 * 
 * Process:
 * 1. Sends termination signal to process
 * 2. Waits for confirmation
 * 3. Reports success or failure
 * 
 * @param {number} processId - ID of the process to stop
 * @param {Function} updateConsole - Optional callback for console updates
 * @throws {Error} If process termination fails
 */
export const stopPostCliProcess = async (
  processId: number,
  updateConsole?: (command: string, output: string) => void
): Promise<void> => {
  console.log('Attempting to stop postcli process:', processId);
  const commandStr = `Stop postcli process ${processId}`;

  if (updateConsole) {
    updateConsole(commandStr, `> Attempting to stop process ${processId}...`);
  }

  try {
    const response = await invoke<string>('stop_postcli_process', {
      pid: processId,
    });
    console.log('Stop process response:', response);

    if (updateConsole) {
      updateConsole(commandStr, `> ${response}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error stopping postcli process:', error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    throw error;
  }
};

/**
 * Low-level function to execute postcli commands directly with arguments
 * Used by other service functions and external components
 * 
 * Features:
 * - Direct command execution with raw arguments
 * - Real-time output streaming
 * - Comprehensive error handling
 * - Console output formatting
 * 
 * @param {string[]} args - Command line arguments for postcli
 * @param {Function} updateConsole - Optional callback for console updates
 * @returns {Promise<PostCliResponse>} Command execution results
 * @throws {Error} If command execution fails
 */
export const callPostCli = async (
  args: string[],
  updateConsole?: (command: string, output: string) => void
): Promise<PostCliResponse> => {
  console.log('callPostCli called with args:', args);
  const commandStr = `./postcli ${args.join(' ')}`;

  if (updateConsole) {
    updateConsole(commandStr, '> Executing command...');
  }

  try {
    console.log('Invoking Tauri command with args:', args);
    const response = await invoke<{ stdout: string; stderr: string }>(
      'run_postcli_command',
      { args }
    );
    console.log('Command response:', response);

    // Handle stdout output
    if (response.stdout && response.stdout.trim()) {
      console.log('Command stdout:', response.stdout);
      updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
    }

    // Handle stderr output (may contain errors or warnings)
    if (response.stderr && response.stderr.trim()) {
      console.error('Command stderr:', response.stderr);
      updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
    }

    // Handle case where command produces no output
    if (!response.stdout && !response.stderr) {
      console.log('Command completed with no output');
      updateConsole?.(commandStr, '> Command completed with no output');
    }

    return {
      ...response,
      success:
        !response.stderr?.includes('error') &&
        !response.stderr?.includes('Error'),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error executing postcli:', error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    throw error;
  }
};

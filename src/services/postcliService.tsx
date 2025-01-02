import { invoke } from "@tauri-apps/api/tauri";
import { listen } from '@tauri-apps/api/event';

import { Settings } from "../state/SettingsContext";
import { buildPostCliArgs, validateSettings } from "../utils/postcliUtils";

// Mock ATX ID response - will be replaced with actual API call
const MOCK_ATX_RESPONSE = {
  atxId: "65f77244a23870ee39f15cf088ee1651745c3b73195491e277bc65aa56937425"
};

export interface PostCliResponse {
  stdout: string;
  stderr: string;
  success: boolean;
}

export interface AtxIdResponse {
  atxId: string;
}

export interface DetachedProcessResponse {
  process_id: number;
  message: string;
}

export const fetchLatestAtxId = async (): Promise<AtxIdResponse> => {
  // TODO: Replace with actual API call when endpoint is available
  // const response = await fetch('https://mainnet-api.spacemesh.network/spacemesh.v2alpha1.ActivationService/Highest');
  // return response.json();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_ATX_RESPONSE;
};

export const executePostCli = async (
  settings: Settings,
  updateConsole?: (command: string, output: string) => void
): Promise<PostCliResponse> => {
  console.log("executePostCli called with settings:", settings);

  const validationError = validateSettings(settings);
  if (validationError) {
    console.error("Validation error:", validationError);
    if (updateConsole) {
      updateConsole("validate", `Validation Error: ${validationError}`);
    }
    throw new Error(validationError);
  }

  const args = buildPostCliArgs(settings);
  if (!args) {
    const error = "Cannot proceed: Valid ATX ID is required";
    console.error(error);
    if (updateConsole) {
      updateConsole("validate", `Error: ${error}`);
    }
    throw new Error(error);
  }

  const commandStr = `./postcli ${args.join(" ")}`;

  console.log("Executing command:", commandStr);
  if (updateConsole) {
    updateConsole(commandStr, "> Executing command...");
  }

  try {
    console.log("Invoking Tauri command with args:", args);
    const response = await invoke<{ stdout: string; stderr: string }>(
      "run_postcli_command",
      { args }
    );
    console.log("Command response:", response);

    // Log stdout if present
    if (response.stdout && response.stdout.trim()) {
      console.log("Command stdout:", response.stdout);
      updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
    }

    // Log stderr if present
    if (response.stderr && response.stderr.trim()) {
      console.error("Command stderr:", response.stderr);
      updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
    }

    // If neither stdout nor stderr, log completion
    if (!response.stdout && !response.stderr) {
      console.log("Command completed with no output");
      updateConsole?.(commandStr, "> Command completed with no output");
    }

    return {
      ...response,
      success: !response.stderr?.includes("error") && !response.stderr?.includes("Error"),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error executing postcli:", error);
    updateConsole?.(commandStr, `> Error:\n${errorMessage}`);
    throw error;
  }
};

export const executePostCliDetached = async (
  settings: Settings,
  updateConsole?: (command: string, output: string) => void
): Promise<DetachedProcessResponse> => {
  console.log("executePostCliDetached called with settings:", settings);

  const validationError = validateSettings(settings);
  if (validationError) {
    console.error("Validation error:", validationError);
    if (updateConsole) {
      updateConsole("validate", `Validation Error: ${validationError}`);
    }
    throw new Error(validationError);
  }

  const args = buildPostCliArgs(settings);
  if (!args) {
    const error = "Cannot proceed: Valid ATX ID is required";
    console.error(error);
    if (updateConsole) {
      updateConsole("validate", `Error: ${error}`);
    }
    throw new Error(error);
  }

  const commandStr = `./postcli ${args.join(" ")} (detached)`;

  console.log("Executing command in detached mode:", commandStr);
  if (updateConsole) {
    updateConsole(
      commandStr,
      "> Starting POS data generation in background..."
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
        
        // Emit a custom event for process state updates
        window.dispatchEvent(new CustomEvent('postcli-progress', {
          detail: event.payload
        }));
      }
    });

    console.log("Invoking Tauri detached command with args:", args);
    const response = await invoke<DetachedProcessResponse>(
      "run_postcli_detached",
      { args }
    );
    console.log("Detached command response:", response);

    if (updateConsole) {
      updateConsole(commandStr, `> ${response.message}`);
    }

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error executing postcli in detached mode:", error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    if (unlistenCallback) {
      unlistenCallback(); // Clean up listener on error
    }
    throw error;
  }
};

export const stopPostCliProcess = async (
  processId: number,
  updateConsole?: (command: string, output: string) => void
): Promise<void> => {
  console.log("Attempting to stop postcli process:", processId);
  const commandStr = `Stop postcli process ${processId}`;

  if (updateConsole) {
    updateConsole(commandStr, `> Attempting to stop process ${processId}...`);
  }

  try {
    const response = await invoke<string>("stop_postcli_process", { pid: processId });
    console.log("Stop process response:", response);

    if (updateConsole) {
      updateConsole(commandStr, `> ${response}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error stopping postcli process:", error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    throw error;
  }
};

export const callPostCli = async (
  args: string[],
  updateConsole?: (command: string, output: string) => void
): Promise<PostCliResponse> => {
  console.log("callPostCli called with args:", args);
  const commandStr = `./postcli ${args.join(" ")}`;

  if (updateConsole) {
    updateConsole(commandStr, "> Executing command...");
  }

  try {
    console.log("Invoking Tauri command with args:", args);
    const response = await invoke<{ stdout: string; stderr: string }>(
      "run_postcli_command",
      { args }
    );
    console.log("Command response:", response);

    // Log stdout if present
    if (response.stdout && response.stdout.trim()) {
      console.log("Command stdout:", response.stdout);
      updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
    }

    // Log stderr if present
    if (response.stderr && response.stderr.trim()) {
      console.error("Command stderr:", response.stderr);
      updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
    }

    // If neither stdout nor stderr, log completion
    if (!response.stdout && !response.stderr) {
      console.log("Command completed with no output");
      updateConsole?.(commandStr, "> Command completed with no output");
    }

    return {
      ...response,
      success: !response.stderr?.includes("error") && !response.stderr?.includes("Error"),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error executing postcli:", error);
    if (updateConsole) {
      updateConsole(commandStr, `> Error:\n${errorMessage}`);
    }
    throw error;
  }
};

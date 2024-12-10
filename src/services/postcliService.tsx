import { invoke } from '@tauri-apps/api/tauri';
import { Settings } from '../state/SettingsContext';
import { buildPostCliArgs, validateSettings } from '../utils/postcliUtils';

export interface PostCliResponse {
    stdout: string;
    stderr: string;
    success: boolean;
}

export const executePostCli = async (
    settings: Settings,
    updateConsole?: (command: string, output: string) => void
): Promise<PostCliResponse> => {
    console.log('executePostCli called with settings:', settings);

    const validationError = validateSettings(settings);
    if (validationError) {
        console.error('Validation error:', validationError);
        if (updateConsole) {
            updateConsole('validate', `Validation Error: ${validationError}`);
        }
        throw new Error(validationError);
    }

    const args = buildPostCliArgs(settings);
    const commandStr = `./postcli ${args.join(' ')}`;
    
    console.log('Executing command:', commandStr);
    if (updateConsole) {
        updateConsole(commandStr, '> Executing command...');
    }
    
    try {
        console.log('Invoking Tauri command with args:', args);
        const response = await invoke<{ stdout: string; stderr: string }>('run_postcli_command', { args });
        console.log('Command response:', response);

        // Log stdout if present
        if (response.stdout && response.stdout.trim()) {
            console.log('Command stdout:', response.stdout);
            updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
        }
        
        // Log stderr if present
        if (response.stderr && response.stderr.trim()) {
            console.error('Command stderr:', response.stderr);
            updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
        }

        // If neither stdout nor stderr, log completion
        if (!response.stdout && !response.stderr) {
            console.log('Command completed with no output');
            updateConsole?.(commandStr, '> Command completed with no output');
        }
        
        return {
            stdout: response.stdout,
            stderr: response.stderr,
            success: !response.stderr.includes('error') && !response.stderr.includes('Error')
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error executing postcli:', error);
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
    console.log('callPostCli called with args:', args);
    const commandStr = `./postcli ${args.join(' ')}`;
    
    if (updateConsole) {
        updateConsole(commandStr, '> Executing command...');
    }
    
    try {
        console.log('Invoking Tauri command with args:', args);
        const response = await invoke<{ stdout: string; stderr: string }>('run_postcli_command', { args });
        console.log('Command response:', response);

        // Log stdout if present
        if (response.stdout && response.stdout.trim()) {
            console.log('Command stdout:', response.stdout);
            updateConsole?.(commandStr, `> Output:\n${response.stdout.trim()}`);
        }
        
        // Log stderr if present
        if (response.stderr && response.stderr.trim()) {
            console.error('Command stderr:', response.stderr);
            updateConsole?.(commandStr, `> Error Output:\n${response.stderr.trim()}`);
        }

        // If neither stdout nor stderr, log completion
        if (!response.stdout && !response.stderr) {
            console.log('Command completed with no output');
            updateConsole?.(commandStr, '> Command completed with no output');
        }
        
        return {
            stdout: response.stdout,
            stderr: response.stderr,
            success: !response.stderr.includes('error') && !response.stderr.includes('Error')
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error executing postcli:', error);
        if (updateConsole) {
            updateConsole(commandStr, `> Error:\n${errorMessage}`);
        }
        throw error;
    }
};

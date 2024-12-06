import { invoke } from '@tauri-apps/api/tauri';
import { Settings } from '../state/SettingsContext';
import { buildPostCliArgs, validateSettings } from '../utils/postcliUtils';

export interface PostCliResponse {
    stdout: string;
    stderr: string;
    success: boolean;
}

export const executePostCli = async (settings: Settings): Promise<PostCliResponse> => {
    const validationError = validateSettings(settings);
    if (validationError) {
        throw new Error(validationError);
    }

    const args = buildPostCliArgs(settings);
    console.log('Executing postcli with args:', args);
    
    try {
        const response = await invoke<{ stdout: string; stderr: string }>('run_postcli_command', { args });
        return {
            stdout: response.stdout,
            stderr: response.stderr,
            success: !response.stderr.includes('error') && !response.stderr.includes('Error')
        };
    } catch (error) {
        console.error('Error executing postcli:', error);
        throw error;
    }
};

// Helper function for other postcli commands (like listing providers)
export const callPostCli = async (args: string[]): Promise<PostCliResponse> => {
    try {
        const response = await invoke<{ stdout: string; stderr: string }>('run_postcli_command', { args });
        return {
            stdout: response.stdout,
            stderr: response.stderr,
            success: !response.stderr.includes('error') && !response.stderr.includes('Error')
        };
    } catch (error) {
        console.error('Error calling postcli:', error);
        throw error;
    }
};

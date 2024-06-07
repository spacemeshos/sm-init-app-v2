import { invoke } from '@tauri-apps/api/tauri';

export const callPostCli = async (args) => {
    try {
        const response = await invoke('run_postcli_command', { args });
        console.log('Response from postcli:', response);
        return response;
    } catch (error) {
        console.error('Error calling postcli:', error);
        throw error;
    }
};
import { invoke } from '@tauri-apps/api/tauri';

export const callPostCli = async (args) => {
    try {
        if (!Array.isArray(args)) {
            throw new Error('Arguments must be an array');
        }
        const response = await invoke('run_postcli_command', { args });
        console.log('Response from postcli:', response);
        return response;
    } catch (error) {
        console.error('Error calling postcli:', error);
        throw error;
    }
};

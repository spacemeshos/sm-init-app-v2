import { Settings } from '../state/SettingsContext';

export const buildPostCliArgs = (settings: Settings): string[] => {
    const args: string[] = [];

    // Required arguments 
    args.push(`-provider=${settings.provider || 0}`);
    args.push(`-numUnits=${settings.numUnits || 4}`);
    
    // Optional identity - TODO: if not provided, a new ID will be created (handled by postcli)
    if (settings.privateKey) {
        args.push(`-id=${settings.privateKey}`);
    } else if (settings.identityFile) {
        args.push(`-identityFile=${settings.identityFile}`);
    }

    // ATX ID (if provided) - TODO: if not provided, fetch from explorer
    if (settings.atxId) {
        args.push(`-commitmentAtxId=${settings.atxId}`);
    }

    // Directory - if not provided, use the default home/post/data
    if (settings.selectedDir) {
        args.push(`-datadir=${settings.selectedDir}`);
    }

    // Always add genproof
    args.push('-genproof');

    return args;
};

export const validateSettings = (settings: Settings): string | null => {
    if (!settings.selectedDir) {
        return 'Directory must be selected';
    }
    if (!settings.numUnits || settings.numUnits < 4) {
        return 'Number of units must be at least 4';
    }
    if (settings.provider === undefined) {
        return 'Provider must be selected';
    }
    return null;
};

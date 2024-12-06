import { Settings } from '../state/SettingsContext';

export const buildPostCliArgs = (settings: Settings): string[] => {
    const args: string[] = [];

    // Required arguments
    args.push(`-provider=${settings.provider || 0}`);
    args.push(`-numUnits=${settings.numUnits || 4}`);
    
    // Optional identity
    if (settings.privateKey) {
        args.push(`-id=${settings.privateKey}`);
    } else if (settings.identityFile) {
        args.push(`-identityFile=${settings.identityFile}`);
    }

    // ATX ID (if provided)
    if (settings.atxId) {
        args.push(`-commitmentAtxId=${settings.atxId}`);
    }

    // CPU cores and nonces
    if (settings.numCores) {
        args.push(`-numCores=${settings.numCores}`);
    }
    if (settings.numNonces) {
        args.push(`-numNonces=${settings.numNonces}`);
    }

    // Directory
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

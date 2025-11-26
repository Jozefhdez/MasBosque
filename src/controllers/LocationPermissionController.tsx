import { Linking } from 'react-native';
import { logger } from '../utils/logger';

export const useLocationPermissionController = () => {

    const handleOpenSettings = () => {
        logger.log('[Location Permission] Opening settings');
        Linking.openSettings();
    };

    return {
        handleOpenSettings,
    };
};

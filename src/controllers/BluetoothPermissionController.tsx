import { Linking } from 'react-native';
import { logger } from '../utils/logger';

export const useBluetoothPermissionController = () => {

    const handleOpenSettings = () => {
        logger.log('[Bluetooth Permission] Opening settings');
        Linking.openSettings();
    };

    return {
        handleOpenSettings,
    };
};

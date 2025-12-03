import { renderHook } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { useBluetoothPermissionController } from '../../controllers/BluetoothPermissionController';
import { useLocationPermissionController } from '../../controllers/LocationPermissionController';

jest.mock('react-native', () => ({
    Linking: {
        openSettings: jest.fn(),
    },
}));

describe('PermissionControllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('BluetoothPermissionController', () => {
        it('should open device settings when handleOpenSettings is called', () => {
            const { result } = renderHook(() => useBluetoothPermissionController());

            result.current.handleOpenSettings();

            expect(Linking.openSettings).toHaveBeenCalled();
        });
    });

    describe('LocationPermissionController', () => {
        it('should open device settings when handleOpenSettings is called', () => {
            const { result } = renderHook(() => useLocationPermissionController());

            result.current.handleOpenSettings();

            expect(Linking.openSettings).toHaveBeenCalled();
        });
    });
});

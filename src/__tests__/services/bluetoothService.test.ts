/**
 * BluetoothService Tests
 * 
 * Tests for the BluetoothService singleton. The BleManager is mocked 
 * globally in jest.setup.js to ensure consistent behavior.
 */

import { Platform, PermissionsAndroid } from 'react-native';
import BluetoothService from '../../services/bluetoothService';

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    Version: 31,
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
      BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    check: jest.fn(),
    request: jest.fn(),
    requestMultiple: jest.fn(),
  },
}));

describe('BluetoothService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as any).OS = 'ios';
  });

  describe('checkPermission', () => {
    describe('iOS', () => {
      beforeEach(() => {
        (Platform as any).OS = 'ios';
      });

      it('should return true when Bluetooth is powered on (mocked)', async () => {
        // The BleManager is mocked to return PoweredOn by default
        const result = await BluetoothService.checkPermission();
        expect(result).toBe(true);
      });
    });

    describe('Android', () => {
      beforeEach(() => {
        (Platform as any).OS = 'android';
        (Platform as any).Version = 31;
      });

      it('should check all required permissions on Android 12+', async () => {
        (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);

        await BluetoothService.checkPermission();

        expect(PermissionsAndroid.check).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );
        expect(PermissionsAndroid.check).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );
        expect(PermissionsAndroid.check).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      });

      it('should return true when all permissions are granted', async () => {
        (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);

        const result = await BluetoothService.checkPermission();

        expect(result).toBe(true);
      });

      it('should return false when any permission is denied', async () => {
        (PermissionsAndroid.check as jest.Mock)
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(true);

        const result = await BluetoothService.checkPermission();

        expect(result).toBe(false);
      });

      it('should only check location on Android 11 and below', async () => {
        (Platform as any).Version = 30;
        (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);

        await BluetoothService.checkPermission();

        expect(PermissionsAndroid.check).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        expect(PermissionsAndroid.check).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('requestPermissions', () => {
    describe('Android', () => {
      beforeEach(() => {
        (Platform as any).OS = 'android';
        (Platform as any).Version = 31;
      });

      it('should request multiple permissions on Android 12+', async () => {
        (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
          'android.permission.BLUETOOTH_SCAN': 'granted',
          'android.permission.BLUETOOTH_CONNECT': 'granted',
          'android.permission.ACCESS_FINE_LOCATION': 'granted',
        });

        const result = await BluetoothService.requestPermissions();

        expect(PermissionsAndroid.requestMultiple).toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it('should return false when permissions are denied', async () => {
        (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
          'android.permission.BLUETOOTH_SCAN': 'denied',
          'android.permission.BLUETOOTH_CONNECT': 'granted',
          'android.permission.ACCESS_FINE_LOCATION': 'granted',
        });

        const result = await BluetoothService.requestPermissions();

        expect(result).toBe(false);
      });

      it('should only request location on Android 11 and below', async () => {
        (Platform as any).Version = 30;
        (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');

        const result = await BluetoothService.requestPermissions();

        expect(PermissionsAndroid.request).toHaveBeenCalledWith(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        expect(result).toBe(true);
      });
    });
  });

  describe('startScan', () => {
    it('should accept a callback function', async () => {
      const onDeviceFound = jest.fn();
      
      // This should not throw
      await expect(BluetoothService.startScan(onDeviceFound)).resolves.not.toThrow();
    });
  });

  describe('stopScan', () => {
    it('should stop scanning without throwing', () => {
      expect(() => BluetoothService.stopScan()).not.toThrow();
    });
  });

  describe('connect', () => {
    it('should return a device object when connection succeeds', async () => {
      const result = await BluetoothService.connect('test-device-id');
      
      expect(result).not.toBeNull();
    });
  });

  describe('disconnect', () => {
    it('should handle disconnect without throwing', async () => {
      await expect(BluetoothService.disconnect('test-device-id')).resolves.not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should clean up resources without throwing', () => {
      expect(() => BluetoothService.destroy()).not.toThrow();
    });
  });
});

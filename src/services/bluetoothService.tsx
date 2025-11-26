import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { logger } from '../utils/logger';

class BluetoothService {
  private manager: BleManager = new BleManager();
  private scanSubscription: any = null;

  // Check current Bluetooth permission status
  async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS handles BLE permissions automatically when scanning
        const state = await this.manager.state();
        return state === State.PoweredOn;
      }

      if (Platform.OS === 'android') {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
          // Android 12+ requires BLUETOOTH_SCAN and BLUETOOTH_CONNECT
          const scanGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
          );
          const connectGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          );
          const locationGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          return scanGranted && connectGranted && locationGranted;
        } else {
          // Android 11 and below only needs location
          const locationGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return locationGranted;
        }
      }

      return false;
    } catch (error) {
      logger.error('[Bluetooth Service] Error checking permissions:', error);
      return false;
    }
  }

  // Request Bluetooth permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS handles BLE permissions automatically
        const state = await this.manager.state();
        if (state !== State.PoweredOn) {
          logger.warn('[Bluetooth Service] Bluetooth is not powered on');
          return false;
        }
        return true;
      }

      if (Platform.OS === 'android') {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
          // Android 12+ requires multiple permissions
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          return (
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          // Android 11 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }

      return false;
    } catch (error) {
      logger.error('[Bluetooth Service] Error requesting permissions:', error);
      return false;
    }
  }

  // Start scanning for BLE devices
  async startScan(onDeviceFound: (device: Device) => void): Promise<void> {
    try {
      this.stopScan(); // Stop any existing scan

      logger.info('[Bluetooth Service] Starting BLE scan');
      this.scanSubscription = this.manager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            logger.error('[Bluetooth Service] Scan error:', error);
            return;
          }

          if (device && device.name) {
            logger.debug('[Bluetooth Service] Device found:', device.name);
            onDeviceFound(device);
          }
        }
      );
    } catch (error) {
      logger.error('[Bluetooth Service] Error starting scan:', error);
    }
  }

  // Stop scanning
  stopScan(): void {
    if (this.scanSubscription) {
      this.manager.stopDeviceScan();
      this.scanSubscription = null;
      logger.info('[Bluetooth Service] Scan stopped');
    }
  }

  // Connect to a device
  async connect(deviceId: string): Promise<Device | null> {
    try {
      logger.info('[Bluetooth Service] Connecting to device:', deviceId);
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      logger.info('[Bluetooth Service] Connected to device:', device.name);
      return device;
    } catch (error) {
      logger.error('[Bluetooth Service] Connection error:', error);
      return null;
    }
  }

  // Disconnect from a device
  async disconnect(deviceId: string): Promise<void> {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
      logger.info('[Bluetooth Service] Disconnected from device');
    } catch (error) {
      logger.error('[Bluetooth Service] Disconnect error:', error);
    }
  }
}

export default new BluetoothService();

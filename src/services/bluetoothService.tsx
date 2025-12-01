import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { logger } from '../utils/logger';
import { LORA_SERVICE_UUID } from '../constants/loraUUIDs';

class BluetoothService {
  private manager: BleManager = new BleManager();
  private isCurrentlyScanning: boolean = false;
  private discoveredDeviceIds: Set<string> = new Set();

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
        // iOS shows the permission dialog when scanning starts
        // We trigger a brief scan to prompt for permission
        const state = await this.manager.state();
        logger.log('[Bluetooth Service] Bluetooth state:', state);
        
        if (state === State.Unauthorized) {
          logger.warn('[Bluetooth Service] Bluetooth permission denied');
          return false;
        }
        
        if (state === State.PoweredOff) {
          logger.warn('[Bluetooth Service] Bluetooth is powered off');
          return false;
        }
        
        if (state === State.PoweredOn) {
          // Trigger a brief scan to prompt for permission if not already granted
          return new Promise<boolean>((resolve) => {
            logger.log('[Bluetooth Service] Triggering scan to request permission');
            let resolved = false;
            
            this.manager.startDeviceScan(
              null,
              { allowDuplicates: false },
              (error, device) => {
                if (resolved) return;
                
                // Stop the scan
                this.manager.stopDeviceScan();
                resolved = true;
                
                if (error) {
                  logger.error('[Bluetooth Service] Permission scan error:', error);
                  resolve(error.message.includes('unauthorized') ? false : false);
                } else {
                  // Successfully started scanning, permission granted
                  logger.log('[Bluetooth Service] Permission granted');
                  resolve(true);
                }
              }
            );
            
            // Auto-stop after 1 second to ensure we don't scan unnecessarily
            setTimeout(() => {
              if (!resolved) {
                this.manager.stopDeviceScan();
                resolved = true;
                resolve(true);
              }
            }, 1000);
          });
        }
        
        // For Unknown or Resetting states, return false
        logger.warn('[Bluetooth Service] Bluetooth is not ready, state:', state);
        return false;
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
      this.isCurrentlyScanning = true;
      this.discoveredDeviceIds.clear(); // Clear the set for this scan session
      
      this.manager.startDeviceScan(
        [LORA_SERVICE_UUID],
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            logger.error('[Bluetooth Service] Scan error:', error);
            this.isCurrentlyScanning = false;
            return;
          }

          if (device) {
            const hasValidName = !device.name || 
                                 device.name.toLowerCase().includes('ttgo') || 
                                 device.name.toLowerCase().includes('lora');
            
            if (hasValidName) {
              // Check if we've already reported this device in this scan session
              if (this.discoveredDeviceIds.has(device.id)) {
                return; // Skip duplicate
              }
              
              this.discoveredDeviceIds.add(device.id);
              logger.debug('[Bluetooth Service] LoRa node found:', device.name || device.id);
              onDeviceFound(device);
            }
          }
        }
      );
    } catch (error) {
      logger.error('[Bluetooth Service] Error starting scan:', error);
      this.isCurrentlyScanning = false;
      throw error;
    }
  }

  // Stop scanning
  stopScan(): void {
    if (this.isCurrentlyScanning) {
      this.manager.stopDeviceScan();
      this.isCurrentlyScanning = false;
      this.discoveredDeviceIds.clear();
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
      // Check if the device is still connected before attempting disconnect
      const isConnected = await this.manager.isDeviceConnected(deviceId);
      if (!isConnected) {
        logger.info('[Bluetooth Service] Device already disconnected:', deviceId);
        return;
      }
      
      await this.manager.cancelDeviceConnection(deviceId);
      logger.info('[Bluetooth Service] Disconnected from device');
    } catch (error) {
      // Ignore "operation cancelled" errors as they're expected during cleanup
      if (error instanceof Error && error.message.includes('Operation was cancelled')) {
        logger.info('[Bluetooth Service] Disconnect operation cancelled (expected during cleanup)');
      } else {
        logger.error('[Bluetooth Service] Disconnect error:', error);
      }
    }
  }

  // Send location data to a connected device
  async sendLocationData(
    device: Device,
    serviceUUID: string,
    characteristicUUID: string,
    alertUUID: string,
    user: string,
    latitude: number,
    longitude: number,
  ): Promise<boolean> {
    try {
      // Check if device is still connected
      const isConnected = await device.isConnected();
      if (!isConnected) {
        logger.warn('[Bluetooth Service] Device is not connected, cannot send data');
        return false;
      }

      // Round coordinates to 6 decimal places to limit packet size
      const roundedLat = Math.round(latitude * 1000000) / 1000000;
      const roundedLon = Math.round(longitude * 1000000) / 1000000;

      // Create a JSON payload with location data
      const locationPayload = {
        alertUUID: alertUUID,
        user: user,
        lat: roundedLat,
        lon: roundedLon,
        timestamp: new Date().toISOString(),
      };

      // Convert to JSON string and then to base64
      const jsonString = JSON.stringify(locationPayload);
      const base64Data = Buffer.from(jsonString, 'utf-8').toString('base64');

      logger.info('[Bluetooth Service] Sending location data:', locationPayload);

      // Write to the characteristic
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64Data
      );

      logger.info('[Bluetooth Service] Location data sent successfully');
      return true;
    } catch (error) {
      logger.error('[Bluetooth Service] Error sending location data:', error);
      return false;
    }
  }

  // Get all services and characteristics from a device
  async getServicesAndCharacteristics(device: Device): Promise<{
    serviceUUID: string;
    characteristics: Array<{ uuid: string; isWritable: boolean; isReadable: boolean }>;
  }[]> {
    try {
      const services = await device.services();
      const result = [];

      for (const service of services) {
        const characteristics = await device.characteristicsForService(service.uuid);
        const charInfo = characteristics.map(char => ({
          uuid: char.uuid,
          isWritable: char.isWritableWithResponse || char.isWritableWithoutResponse,
          isReadable: char.isReadable,
        }));

        result.push({
          serviceUUID: service.uuid,
          characteristics: charInfo,
        });
      }

      logger.info('[Bluetooth Service] Services and characteristics:', result);
      return result;
    } catch (error) {
      logger.error('[Bluetooth Service] Error getting services/characteristics:', error);
      return [];
    }
  }

  // Clean up resources
  destroy(): void {
    this.stopScan();
    if (this.manager) {
      this.manager.destroy();
      logger.info('[Bluetooth Service] Manager destroyed');
    }
  }
}

export default new BluetoothService();

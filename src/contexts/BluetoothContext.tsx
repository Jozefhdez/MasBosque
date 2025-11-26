import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Device } from 'react-native-ble-plx';
import bluetoothService from '../services/bluetoothService';
import { logger } from '../utils/logger';

interface BluetoothContextType {
    connectedDevice: Device | null;
    hasPermission: boolean | null;
    isScanning: boolean;
    permissionLoading: boolean;
    startScan: (onDeviceFound: (device: Device) => void) => Promise<void>;
    stopScan: () => void;
    connect: (deviceId: string) => Promise<Device | null>;
    disconnect: () => Promise<void>;
    requestPermission: () => Promise<boolean>;
    checkPermission: () => Promise<void>;
    sendLocationData: (
        serviceUUID: string,
        characteristicUUID: string,
        user: number,
        latitude: number,
        longitude: number,
        accuracy?: number | null
    ) => Promise<boolean>;
    getServicesAndCharacteristics: () => Promise<{
        serviceUUID: string;
        characteristics: Array<{ uuid: string; isWritable: boolean; isReadable: boolean }>;
    }[]>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);

    // Check permission status on mount and request if not granted
    useEffect(() => {
        let isMounted = true;

        const initializePermission = async () => {
            try {
                setPermissionLoading(true);
                const granted = await bluetoothService.checkPermission();
                
                if (!isMounted) return;
                
                // If permission is not granted, request it automatically
                if (!granted) {
                    const requestGranted = await bluetoothService.requestPermissions();
                    
                    if (!isMounted) return;
                    
                    setHasPermission(requestGranted);
                } else {
                    setHasPermission(granted);
                }
            } catch (error) {
                if (!isMounted) return;
                
                logger.error('[Bluetooth Context] Error initializing permission:', error);
                setHasPermission(false);
            } finally {
                if (isMounted) {
                    setPermissionLoading(false);
                }
            }
        };
        
        initializePermission();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    const checkPermission = async () => {
        try {
            setPermissionLoading(true);
            const granted = await bluetoothService.checkPermission();
            setHasPermission(granted);
        } catch (error) {
            logger.error('[Bluetooth Context] Error checking permission:', error);
            setHasPermission(false);
        } finally {
            setPermissionLoading(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            const granted = await bluetoothService.requestPermissions();
            setHasPermission(granted);
            return granted;
        } catch (error) {
            logger.error('[Bluetooth Context] Error requesting permission:', error);
            setHasPermission(false);
            return false;
        }
    };

    const startScan = async (onDeviceFound: (device: Device) => void) => {
        if (isScanning) {
            return;
        }

        try {
            await bluetoothService.startScan(onDeviceFound);
            setIsScanning(true);
        } catch (error) {
            logger.error('[Bluetooth Context] Failed to start scan:', error);
            
            // Check if it's a permission error
            if (error instanceof Error && error.message.includes('permission')) {
                setHasPermission(false);
            }
            throw error;
        }
    };

    const stopScan = () => {
        bluetoothService.stopScan();
        setIsScanning(false);
    };

    const connect = async (deviceId: string): Promise<Device | null> => {
        try {
            const device = await bluetoothService.connect(deviceId);
            setConnectedDevice(device);
            return device;
        } catch (error) {
            logger.error('[Bluetooth Context] Failed to connect:', error);
            return null;
        }
    };

    const disconnect = async () => {
        if (!connectedDevice) {
            return;
        }

        await bluetoothService.disconnect(connectedDevice.id);
        setConnectedDevice(null);
    };

    const sendLocationData = async (
        serviceUUID: string,
        characteristicUUID: string,
        user: number,
        latitude: number,
        longitude: number,
        accuracy?: number | null
    ): Promise<boolean> => {

        if (!connectedDevice) {
            logger.error('[Bluetooth Context] No device connected');
            return false;
        }

        return await bluetoothService.sendLocationData(
            connectedDevice,
            serviceUUID,
            characteristicUUID,
            user,
            latitude,
            longitude,
        );
    };

    const getServicesAndCharacteristics = async () => {
        if (!connectedDevice) {
            logger.error('[Bluetooth Context] No device connected');
            return [];
        }

        return await bluetoothService.getServicesAndCharacteristics(connectedDevice);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            logger.log('[Bluetooth Context] Cleaning up on unmount');
            if (isScanning) {
                bluetoothService.stopScan();
            }
            if (connectedDevice) {
                bluetoothService.disconnect(connectedDevice.id).catch((error) => {
                    logger.error('[Bluetooth Context] Error disconnecting on unmount:', error);
                });
            }
        };
    }, [isScanning, connectedDevice]);

    const value: BluetoothContextType = {
        connectedDevice,
        hasPermission,
        isScanning,
        permissionLoading,
        startScan,
        stopScan,
        connect,
        disconnect,
        requestPermission,
        checkPermission,
        sendLocationData,
        getServicesAndCharacteristics,
    };

    return <BluetoothContext.Provider value={value}>{children}</BluetoothContext.Provider>;
};

export const useBluetooth = (): BluetoothContextType => {
    const context = useContext(BluetoothContext);
    if (context === undefined) {
        throw new Error('useBluetooth must be used within a BluetoothProvider');
    }
    return context;
};

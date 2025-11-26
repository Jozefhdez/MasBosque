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
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);

    // Check permission status on mount and request if not granted
    useEffect(() => {
        const initializePermission = async () => {
            try {
                setPermissionLoading(true);
                const granted = await bluetoothService.checkPermission();
                logger.log('[Bluetooth Context] Initial permission check:', granted ? 'granted' : 'not granted');
                
                // If permission is not granted, request it automatically
                if (!granted) {
                    logger.log('[Bluetooth Context] Permission not granted, requesting automatically');
                    const requestGranted = await bluetoothService.requestPermissions();
                    setHasPermission(requestGranted);
                    logger.log('[Bluetooth Context] Permission request result:', requestGranted ? 'granted' : 'denied');
                } else {
                    setHasPermission(granted);
                }
            } catch (error) {
                logger.error('[Bluetooth Context] Error initializing permission:', error);
                setHasPermission(false);
            } finally {
                setPermissionLoading(false);
            }
        };
        
        initializePermission();
    }, []);

    const checkPermission = async () => {
        try {
            setPermissionLoading(true);
            const granted = await bluetoothService.checkPermission();
            setHasPermission(granted);
            logger.log('[Bluetooth Context] Permission status:', granted ? 'granted' : 'not granted');
        } catch (error) {
            logger.error('[Bluetooth Context] Error checking permission:', error);
            setHasPermission(false);
        } finally {
            setPermissionLoading(false);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            logger.log('[Bluetooth Context] Requesting permission');
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
            logger.log('[Bluetooth Context] Already scanning');
            return;
        }

        try {
            logger.log('[Bluetooth Context] Starting BLE scan');
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
        logger.log('[Bluetooth Context] Stopping BLE scan');
        bluetoothService.stopScan();
        setIsScanning(false);
    };

    const connect = async (deviceId: string): Promise<Device | null> => {
        try {
            logger.log('[Bluetooth Context] Connecting to device:', deviceId);
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
            logger.log('[Bluetooth Context] No device connected');
            return;
        }

        logger.log('[Bluetooth Context] Disconnecting from device');
        await bluetoothService.disconnect(connectedDevice.id);
        setConnectedDevice(null);
    };

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

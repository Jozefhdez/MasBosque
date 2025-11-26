import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocation } from '../contexts/LocationContext';
import { useBluetooth } from '../contexts/BluetoothContext';
import { Device } from 'react-native-ble-plx';
import { LORA_SERVICE_UUID, LORA_LOCATION_CHARACTERISTIC_UUID } from '../constants/loraUUIDs';

export const useSOSController = () => {

    const navigation = useNavigation<NavigationProp>();

    const { userProfile, loading } = useUser();
    const { currentLocation, startTracking, stopTracking, isTracking } = useLocation();
    const { startScan, stopScan, connect, sendLocationData, disconnect } = useBluetooth();
    const [discoveredNodes, setDiscoveredNodes] = useState<Device[]>([]);
    const [connectedNodes, setConnectedNodes] = useState<Set<string>>(new Set());

    const [isConnected, setIsConnected] = useState(false);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (userProfile?.name || userProfile?.last_name) {
            setUserName(`${userProfile.name} ${userProfile.last_name}`);
        }

        if (userProfile?.photo_url) {
            setUserPhoto(userProfile.photo_url);
        }
    }, [userProfile]);

    const handleGoProfile = async () => {
        logger.log('[SOS Controller] Go to Profile');
        navigation.navigate('Profile');
    };

    const handleSOSPress = async () => {
        setIsSOSActive(true);
        logger.log('[SOS Controller] SOS Activated');

        try {
            await startScan(async (device) => {
                setDiscoveredNodes(prev => {
                    if (!prev.find(d => d.id === device.id)) {
                        // Connect to the node immediately when discovered
                        connect(device.id, (disconnectedDeviceId) => {
                            // Handle disconnection
                            logger.warn('[SOS Controller] Node disconnected:', disconnectedDeviceId);
                            setConnectedNodes(prevSet => {
                                const newSet = new Set(prevSet);
                                newSet.delete(disconnectedDeviceId);
                                setIsConnected(newSet.size > 0);
                                return newSet;
                            });
                        }).then((connectedDevice) => {
                            if (connectedDevice) {
                                setConnectedNodes(prevSet => {
                                    const newSet = new Set(prevSet).add(device.id);
                                    setIsConnected(newSet.size > 0);
                                    return newSet;
                                });
                                logger.log('[SOS Controller] Connected to node:', device.name || device.id);
                            }
                        }).catch((error) => {
                            logger.error('[SOS Controller] Failed to connect to node:', error);
                        });
                        return [...prev, device];
                    }
                    return prev;
                });
            });
        } catch (error) {
            logger.error('[SOS Controller] Bluetooth scan failed:', error);
            setIsSOSActive(false);
        }
        
        try {
            await startTracking();
        } catch (error) {
            logger.error('[SOS Controller] Location tracking failed:', error);
            setIsSOSActive(false);
        }
    };

    // Send location updates when SOS is active
    useEffect(() => {
        if (isSOSActive && currentLocation) {
            logger.log('[SOS Controller] Location updated:', {
                lat: currentLocation.coords.latitude,
                lon: currentLocation.coords.longitude,
                timestamp: new Date(currentLocation.timestamp).toISOString(),
                connectedNodes: connectedNodes.size
            });

            if (connectedNodes.size === 0) {
                logger.warn('[SOS Controller] No nodes connected - location not being sent');
                return;
            }
            
            // Send to all connected nodes
            discoveredNodes.forEach(async (node) => {
                if (connectedNodes.has(node.id)) {
                    try {
                        const success = await sendLocationData(
                            LORA_SERVICE_UUID,
                            LORA_LOCATION_CHARACTERISTIC_UUID,
                            userProfile?.id || '',
                            currentLocation.coords.latitude,
                            currentLocation.coords.longitude,
                        );
                        if (success) {
                            logger.log('[SOS Controller] Payload sent successfully to:', node.name || node.id);
                        } else {
                            logger.error('[SOS Controller] Failed to send payload to:', node.name || node.id);
                        }
                    } catch (error) {
                        logger.error('[SOS Controller] Error sending payload to node:', error);
                    }
                }
            });
        }
    }, [currentLocation, isSOSActive]);

    const handleSOSCancel = async () => {
        setIsSOSActive(false);
        logger.log('[SOS Controller] SOS Cancelled');
        
        // Stop location tracking
        stopTracking();
        
        // Stop scanning for new nodes
        stopScan();
        
        // Disconnect from all nodes
        discoveredNodes.forEach(async (node) => {
            if (connectedNodes.has(node.id)) {
                try {
                    await disconnect();
                    logger.log('[SOS Controller] Disconnected from:', node.name || node.id);
                } catch (error) {
                    logger.error('[SOS Controller] Error disconnecting from node:', error);
                }
            }
        });
        
        // Clear discovered and connected nodes
        setDiscoveredNodes([]);
        setConnectedNodes(new Set());
        setIsConnected(false);
    };

    return {
        isConnected,
        isSOSActive,
        userName,
        userPhoto,
        currentLocation,
        handleGoProfile,
        handleSOSPress,
        handleSOSCancel
    };
}
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocation } from '../contexts/LocationContext';
import { useBluetooth } from '../contexts/BluetoothContext';
import { Device } from 'react-native-ble-plx';
import { LORA_SERVICE_UUID, LORA_LOCATION_CHARACTERISTIC_UUID } from '../constants/loraUUIDs';
import { randomUUID } from 'expo-crypto';

export const useSOSController = () => {

    const navigation = useNavigation<NavigationProp>();

    const { userProfile, loading } = useUser();
    const { currentLocation, startTracking, stopTracking, isTracking } = useLocation();
    const { startScan, stopScan, connect, sendLocationData, disconnect } = useBluetooth();
    const [discoveredNodes, setDiscoveredNodes] = useState<Device[]>([]);
    const [connectedNodes, setConnectedNodes] = useState<Set<string>>(new Set());
    const activeSendOperations = useRef(0);

    const [isConnected, setIsConnected] = useState(false);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [alertUUID, setAlertUUID] = useState<string>('');
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
        // Generate a new UUID for this SOS session
        const sessionUUID = randomUUID();
        setAlertUUID(sessionUUID);
        setIsSOSActive(true);
        logger.log('[SOS Controller] SOS Activated with UUID:', sessionUUID);

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
        if (!isSOSActive || !currentLocation) {
            return;
        }

        logger.log('[SOS Controller] Location updated:', {
            lat: currentLocation.coords.latitude,
            lon: currentLocation.coords.longitude,
            timestamp: new Date(currentLocation.timestamp).toISOString(),
            connectedNodes: connectedNodes.size
        });

        if (connectedNodes.size === 0) {
            logger.info('[SOS Controller] No nodes connected - location not being sent');
            return;
        }
        
        // Send to all connected nodes
        const sendToNodes = async () => {
            for (const node of discoveredNodes) {
                // Re-check if still connected before each send
                if (!connectedNodes.has(node.id) || !isSOSActive) {
                    continue;
                }
                
                activeSendOperations.current++;
                try {
                    const success = await sendLocationData(
                        LORA_SERVICE_UUID,
                        LORA_LOCATION_CHARACTERISTIC_UUID,
                        alertUUID,
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
                } finally {
                    activeSendOperations.current--;
                }
            }
        };
        
        sendToNodes();
    }, [currentLocation, isSOSActive, connectedNodes, alertUUID]);

    const handleSOSCancel = async () => {
        // Stop SOS first to prevent location effect from triggering
        setIsSOSActive(false);
        setAlertUUID('');
        logger.log('[SOS Controller] SOS Cancelled');
        
        // Stop location tracking
        stopTracking();
        
        // Stop scanning for new nodes
        stopScan();
        
        // Clear connected nodes set immediately to prevent further sends
        const nodesToDisconnect = Array.from(connectedNodes);
        setConnectedNodes(new Set());
        setIsConnected(false);
        
        // Wait for any in-flight send operations to complete
        const maxWaitTime = 5000; // 2 seconds max
        const startWait = Date.now();
        while (activeSendOperations.current > 0 && (Date.now() - startWait) < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        if (activeSendOperations.current > 0) {
            logger.warn('[SOS Controller] Timed out waiting for send operations to complete');
        }
        
        // Disconnect from all nodes
        for (const nodeId of nodesToDisconnect) {
            try {
                await disconnect(nodeId);
                const node = discoveredNodes.find(n => n.id === nodeId);
                logger.log('[SOS Controller] Disconnected from:', node?.name || nodeId);
            } catch (error) {
                logger.error('[SOS Controller] Error disconnecting from node:', error);
            }
        }
        
        // Clear discovered nodes
        setDiscoveredNodes([]);
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
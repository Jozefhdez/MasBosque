import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocation } from '../contexts/LocationContext';


export const useSOSController = () => {

    const navigation = useNavigation<NavigationProp>();

    const { userProfile, loading } = useUser();
    const { currentLocation, startTracking, stopTracking, isTracking } = useLocation();

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
            await startTracking();
        } catch (error) {
            logger.error('[SOS Controller] Location tracking failed:', error);
            setIsSOSActive(false);
        }
    };

    // Log location updates when SOS is active
    useEffect(() => {
        if (isSOSActive && currentLocation) {
            logger.log('[SOS Controller] Location updated:', {
                lat: currentLocation.coords.latitude,
                lon: currentLocation.coords.longitude,
                timestamp: new Date(currentLocation.timestamp).toISOString()
            });
            // TODO: Send location to emergency contacts or Bluetooth
        }
    }, [currentLocation, isSOSActive]);

    const handleSOSCancel = () => {
        setIsSOSActive(false);
        logger.log('[SOS Controller] SOS Cancelled');
        
        // Stop location tracking when SOS is cancelled
        stopTracking();
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
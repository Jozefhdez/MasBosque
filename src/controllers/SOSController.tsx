import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';


export const useSOSController = () => {

    const navigation = useNavigation<NavigationProp>();

    const { userProfile, loading } = useUser();

    const [isConnected, setIsConnected] = useState(false);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
        if (userProfile?.name || userProfile?.last_name) {
            setUserName(`${userProfile.name} ${userProfile.last_name}`);
        }
    }, [userProfile]);

    const handleGoProfile = async () => {
        logger.log('[SOS Controller] Go to Profile');
        navigation.navigate('Profile');
    };

    const handleSOSPress = () => {
        setIsSOSActive(true);
        logger.log('[SOS Controller] SOS Activated');
        // Add your SOS activation logic here
    };

    const handleSOSCancel = () => {
        setIsSOSActive(false);
        logger.log('[SOS Controller] SOS Cancelled');
        // Add your SOS cancellation logic here
    };

    return {
        isConnected,
        isSOSActive,
        userName,
        userPhoto,
        handleGoProfile,
        handleSOSPress,
        handleSOSCancel
    };
}
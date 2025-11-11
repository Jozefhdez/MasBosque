import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState } from 'react';

export const useSOSController = () => {

    const navigation = useNavigation<NavigationProp>();

    const [isConnected, setIsConnected] = useState(false);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [userName, setUserName] = useState('Juan Alfredo Peréz');
    const [userPhoto, setUserPhoto] = useState(null);

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
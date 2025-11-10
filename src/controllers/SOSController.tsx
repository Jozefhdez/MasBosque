import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const SOSController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoProfile = async () => {
        logger.log('[SOS Controller] Go to Profile');
        navigation.navigate('Profile');
    };


    return {
        handleGoProfile
    };
}
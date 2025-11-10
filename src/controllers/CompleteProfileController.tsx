import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const CompleteProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoSOS = async () => {
        logger.log('[CompleteProfile Controller] Go to SOS');
        navigation.navigate('SOS');
    };

    return {
        handleGoSOS
    };
}
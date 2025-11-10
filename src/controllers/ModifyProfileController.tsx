import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const ModifyProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoBack = async () => {
        logger.log('[ModifyProfile Controller] Go back to Landing Screen');
        navigation.goBack();
    };


    return {
        handleGoBack
    };
}
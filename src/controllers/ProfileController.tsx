import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const ProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoBack = async () => {
        logger.log('[Profile Controller] Go back to Landing Screen');
        navigation.goBack();
    };

    const handleGoModifyProfile = async () => {
        logger.log('[Profile Controller] Go to Modify Profile');
        navigation.navigate('ModifyProfile');
    };


    return {
        handleGoBack,
        handleGoModifyProfile
    };
}
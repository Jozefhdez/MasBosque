import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const SignInController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoSignUp = async () => {
        logger.log('[SignIn Controller] Go to Sign Up Screen');
        navigation.navigate('SignUp');
    };

    const handleGoSOS = async () => {
        logger.log('[SignIn Controller] Go to SOS');
        navigation.navigate('SOS');
    };

    return {
        handleGoSignUp,
        handleGoSOS
    };
}
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const SignUpController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoSignIn = async () => {
        logger.log('[SignUp Controller] Go to Sign In Screen');
        navigation.navigate('SignIn');
    };

    const handleGoCompleteProfile = async () => {
        logger.log('[SignUp Controller] Go to Complete Profile');
        navigation.navigate('CompleteProfile');
    };

    return {
        handleGoSignIn,
        handleGoCompleteProfile
    };
}
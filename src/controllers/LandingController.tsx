import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const LandingController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoSignIn = async () => {
        logger.log('[Landing Controller] Go to sign in');
        navigation.navigate('SignIn');
    };

    const handleGoSignUp = async () => {
        logger.log('[Landing Controller] Go to sign up');
        navigation.navigate('SignUp');
    };

    return {
        handleGoSignIn,
        handleGoSignUp
    };
}
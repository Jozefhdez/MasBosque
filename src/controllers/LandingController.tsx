import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const LandingController = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleGoSignIn = async () => {
        logger.log('[Landing Controller] Go to Sign In');
        navigation.navigate('SignIn');
    };

    const handleGoSignUp = async () => {
        logger.log('[Landing Controller] Go to Sign Up');
        navigation.navigate('SignUp');
    };

    return {
        handleGoSignIn,
        handleGoSignUp
    };
}
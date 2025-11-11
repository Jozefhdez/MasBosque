import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { useState } from 'react';
import { logger } from '../utils/logger';

export const useSignInController = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation<NavigationProp>();

    const handleGoSignUp = async () => {
        logger.log('[SignIn Controller] Go to Sign Up Screen');
        navigation.navigate('SignUp');
    };

    const handleGoSOS = async () => {
        logger.log('[SignIn Controller] Go to SOS');
        navigation.navigate('SOS');
    };

    const handleForgotPassword = async () => {
        logger.log('[SignIn Controller] Forgot Password')
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        handleGoSignUp,
        handleGoSOS,
        handleForgotPassword
    };
}
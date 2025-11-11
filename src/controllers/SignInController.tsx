import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { useState } from 'react';
import { logger } from '../utils/logger';
import { useAuth } from '../contexts/AuthContext';

export const useSignInController = () => {
    
    const { signIn } = useAuth()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation<NavigationProp>();

    const handleGoSignUp = async () => {
        logger.log('[SignIn Controller] Go to Sign Up Screen');
        navigation.navigate('SignUp');
    };

    const handleSignIn = async () => {
        try {
            logger.log('[SignIn Controller] Attempting sign in');
            
            if (!email || !password) {
                logger.log('[SignIn Controller] Email or password is empty');
                return;
            }

            await signIn(email, password);
            
            logger.log('[SignIn Controller] Sign in successful');
            // navigation.navigate('SOS');
        } catch (error) {
            logger.log('[SignIn Controller] Sign in failed:', error);
        }
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
        handleSignIn,
        handleForgotPassword
    };
}
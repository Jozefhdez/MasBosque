import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState } from 'react';

export const useSignUpController = () => {
    const navigation = useNavigation<NavigationProp>();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [readTOS, setReadTOS] = useState(false)

    const handleGoSignIn = async () => {
        logger.log('[SignUp Controller] Go to Sign In Screen');
        navigation.navigate('SignIn');
    };

    const handleGoCompleteProfile = async () => {
        logger.log('[SignUp Controller] Go to Complete Profile');
        navigation.navigate('CompleteProfile');
    };

    const handleTOS = () => {
        logger.log('[SignUp Controller] Open Terms of Service');
    };

    const handlePA = () => {
        logger.log('[SignUp Controller] Open Privacy Agreement');
    };

    return {
        name,
        setName,
        lastName,
        setLastName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        readTOS,
        setReadTOS,
        handleGoSignIn,
        handleGoCompleteProfile,
        handleTOS,
        handlePA
    };
}
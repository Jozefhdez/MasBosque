import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const useSignUpController = () => {
    const navigation = useNavigation<NavigationProp>();

    const { signUp } = useAuth();

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

    const handleSignUp = async () => {
        try {
            logger.log('[SignUp Controller] Attempting sign up');

            // Validation: Check for empty fields
            if (!name.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
                Alert.alert('Error', 'Por favor completa todos los campos.');
                logger.log('[SignUp Controller] Empty fields detected');
                return;
            }

            // Validation: Check name
            const alphaRegex = /^[\p{L}\s]+$/u;

            if (!alphaRegex.test(name)) {
                Alert.alert('Error', 'El nombre solo puede contener letras.');
                return;
            }

            if (!alphaRegex.test(lastName)) {
                Alert.alert('Error', 'El apellido solo puede contener letras.');
                return;
            }

            // Validation: Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Validation: Check password length
            if (password.length < 8) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres.');
                return;
            }

            // Validate password strength
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasDigit = /\d/.test(password);
            const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

            if (!hasUppercase || !hasLowercase || !hasDigit || !hasSymbol) {
                Alert.alert(
                    'Error',
                    'La contraseña debe contener al menos:\n• Una letra mayúscula\n• Una letra minúscula\n• Un número\n• Un símbolo (!@#$%^&*, etc.)'
                );
                return;
            }

            // Validation: Check if terms of service are accepted
            if (!readTOS) {
                Alert.alert('Error', 'Debes aceptar los términos y condiciones para continuar.');
                return;
            }

            await signUp(email, password, name, lastName);

            logger.log('[SignUp Controller] Sign up successful');
            Alert.alert(
                'Cuenta creada',
                'Tu cuenta ha sido creada exitosamente. Por favor verifica tu correo electrónico.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate("SignIn")
                    }
                ]
            );

        } catch (error: any) {
            logger.error('[SignUp Controller] Sign up failed:', error);

            if (error?.message?.includes('already registered')) {
                Alert.alert('Error', 'Este correo electrónico ya está registrado.');
            } else {
                Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
            }
        }
    };

    const handleTOS = () => {
        logger.log('[SignUp Controller] Open Terms of Service');
        // TODO: Show TOS
    };

    const handlePA = () => {
        logger.log('[SignUp Controller] Open Privacy Agreement');
        // TODO: Show PA
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
        handleSignUp,
        handleTOS,
        handlePA
    };
}
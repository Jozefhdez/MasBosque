import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { useState } from 'react';
import { Alert } from 'react-native';
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
            
            // Validation: Check for empty fields
            if (!email.trim() || !password.trim()) {
                Alert.alert('Error', 'Por favor completa todos los campos.');
                logger.log('[SignIn Controller] Email or password is empty');
                return;
            }

            // Validation: Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
                return;
            }

            await signIn(email, password);
            
            logger.log('[SignIn Controller] Sign in successful');
        } catch (error: any) {

            if (error?.message?.includes('Email not confirmed')) {
                Alert.alert('Error', 'Por favor confirma tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
                logger.info('[SignIn Controller] Email not confirmed:', error);
            } else if (error?.message?.includes('Invalid login credentials')) {
                Alert.alert('Error', 'Correo o contraseña incorrectos.');
                logger.info('[SignIn Controller] Sign in failed:', error);
            } else {
                Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo.');
                logger.error('[SignIn Controller] Sign in failed:', error);
            }
        }
    };

    const handleForgotPassword = async () => {
        logger.log('[SignIn Controller] Forgot Password');

        // Validation: Check if email is provided
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico para recuperar tu contraseña.');
            return;
        }

        // Validation: Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
            return;
        }

        Alert.alert(
            'Recuperar contraseña',
            'Se enviará un correo para restablecer tu contraseña.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Enviar',
                    onPress: async () => {
                        // TODO: Implement password reset functionality
                        logger.log('[SignIn Controller] Password reset email sent to:', email);
                        Alert.alert('Correo enviado', 'Revisa tu correo para restablecer tu contraseña.');
                    }
                }
            ]
        );
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
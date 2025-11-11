import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';

export const ProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const [userName] = useState<string>('Juan Alfredo Peréz Gonzalez');
    const [userPhoto] = useState<string | null>('');
    const [allergies] = useState<string[]>(['Ibuprofeno', 'Abejas', 'Epinefrina']);

    const handleGoBack = async () => {
        logger.log('[Profile Controller] Go back to previous screen');
        navigation.goBack();
    };

    const handleGoModifyProfile = async () => {
        logger.log('[Profile Controller] Go to Modify Profile');
        navigation.navigate('ModifyProfile');
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        logger.log('[Profile Controller] User signed out');
                        navigation.navigate('Landing');
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Eliminar cuenta',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        logger.log('[Profile Controller] User requested account deletion');
                        Alert.alert(
                            'Cuenta eliminada',
                            'Tu cuenta ha sido eliminada exitosamente.'
                        );
                        navigation.navigate('Landing');
                    },
                },
            ]
        );
    };

    return {
        userName,
        userPhoto,
        allergies,
        handleGoBack,
        handleGoModifyProfile,
        handleSignOut,
        handleDeleteAccount
    };
}
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext'
import { UserAllergies } from '../models/userAllergiesModel';

export const useProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const { userProfile, userAllergies, loading } = useUser();

    const { signOut } = useAuth()

    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [allergies, setAllergies] = useState<UserAllergies[]>([]);

    useEffect(() => {
        if (userProfile?.name || userProfile?.last_name) {
            setUserName(`${userProfile.name} ${userProfile.last_name}`);
        }

        if (userProfile?.photo_url) {
            setUserPhoto(userProfile.photo_url);
        }

        if (userAllergies && userAllergies.length > 0) {
            setAllergies(userAllergies);
        }
    }, [userProfile, userAllergies]);

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
                        await signOut()
                        logger.log('[Profile Controller] User signed out');
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
                        // TODO: delete account logic
                        await signOut()
                        logger.log('[Profile Controller] User signed out');
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
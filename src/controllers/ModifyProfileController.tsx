import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { UserAllergies } from '../models/userAllergiesModel';

export const useModifyProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const { userProfile, userAllergies, loading } = useUser();

    const [userName, setUserName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [allergies, setAllergies] = useState<UserAllergies[]>([]);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (userProfile?.name) {
            setUserName(userProfile.name);
        }

        if (userProfile?.last_name) {
            setLastName(userProfile.last_name)
        }

        if (userProfile?.mail) {
            setEmail(userProfile.mail)
        }

        if (userAllergies && userAllergies.length > 0) {
            setAllergies(userAllergies);
        }
    }, [userProfile, userAllergies]);

    const handleGoBack = async () => {
        logger.log('[ModifyProfile Controller] Go back to previous screen');
        navigation.goBack();
    };

    const handleAllergyChange = (index: number, text: string) => {
        const newAllergies = [...allergies];
        newAllergies[index] = {
            ...newAllergies[index],
            description: text
        };
        setAllergies(newAllergies);
    };

    const handleRemoveAllergy = (index: number) => {
        const newAllergies = allergies.filter((_, i) => i !== index);
        setAllergies(newAllergies);
    };

    const handleClearAllergy = (index: number) => {
        const newAllergies = [...allergies];
        newAllergies[index] = {
            ...newAllergies[index],
            description: ''
        };
        setAllergies(newAllergies);
    };

    const handleAddAllergy = () => {
        const newAllergy: UserAllergies = {
            id: `temp-${Date.now()}`, // Temporary ID for new allergies
            profile_id: userProfile?.id || '',
            description: ''
        };
        setAllergies([...allergies, newAllergy]);
    };

    const handleSave = async () => {
        logger.log('[ModifyProfile Controller] Saving profile changes');
        // TODO: Implement save logic
        Alert.alert(
            'Cambios guardados',
            'Tu información ha sido actualizada exitosamente.',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                }
            ]
        );
    };

    const handleChangePhoto = async () => {
        logger.log('[ModifyProfile Controller] Change profile photo');
        // TODO: Implement photo selection logic
    };

    const handleChangePassword = async () => {
        logger.log('[ModifyProfile Controller] Changing password');
        
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos de contraseña.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // TODO: Implement password change logic
        Alert.alert(
            'Contraseña actualizada',
            'Tu contraseña ha sido cambiada exitosamente.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                    }
                }
            ]
        );
    };

    return {
        // State
        userName,
        lastName,
        email,
        userPhoto,
        allergies,
        oldPassword,
        newPassword,
        confirmPassword,
        showOldPassword,
        showNewPassword,
        showConfirmPassword,
        // Setters
        setUserName,
        setLastName,
        setEmail,
        setShowOldPassword,
        setShowNewPassword,
        setShowConfirmPassword,
        setOldPassword,
        setNewPassword,
        setConfirmPassword,
        // Handlers
        handleGoBack,
        handleAllergyChange,
        handleRemoveAllergy,
        handleClearAllergy,
        handleAddAllergy,
        handleSave,
        handleChangePhoto,
        handleChangePassword
    };
}
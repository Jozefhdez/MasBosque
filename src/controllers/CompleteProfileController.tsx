import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { UserAllergies } from '../models/userAllergiesModel';
import { supabase } from '../services/supabaseClient';

export const useCompleteProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const { userProfile, userAllergies, loading, refreshUser } = useUser();

    const [userName, setUserName] = useState('');
    const [lastName, setLastName] = useState('');
    const [allergies, setAllergies] = useState<UserAllergies[]>([]);
    const [userPhoto, setUserPhoto] = useState('');

    useEffect(() => {
        if (userProfile?.name) {
            setUserName(userProfile.name);
        }

        if (userProfile?.last_name) {
            setLastName(userProfile.last_name)
        }

        if (userAllergies && userAllergies.length > 0) {
            setAllergies(userAllergies);
        }

    }, []);

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
            id: `temp-${Date.now()}`,
            profile_id: userProfile?.id || '',
            description: ''
        };
        setAllergies([...allergies, newAllergy]);
    };

    const handleChangePhoto = async () => {
        logger.log('[CompleteProfile Controller] Upload Image');
    };

    const handleCompleteProfile = async () => {
        logger.log('[CompleteProfile Controller] Saving profile info...');

        
        // Validation: Check that there are no empty allergies
        const alphaRegex = /^[a-zA-Z\s]+$/;

        const hasEmptyAllergies = allergies.some(a => a.description.trim() === '');
        
        if (hasEmptyAllergies) {
            Alert.alert('Error', 'Por favor completa o elimina las alergias vacías.');
            return;
        }

        // Validation: Check regex for allergies
        for (const allergy of allergies) {
            if (allergy.description.trim() !== '' && !alphaRegex.test(allergy.description)) {
                Alert.alert('Error', 'Las alergias solo pueden contener letras.');
                return;
            }
        }

        try {

            // alergies
            const newAllergies = allergies.filter(a => a.id.startsWith('temp-'));

            // Insert new allergies
            for (const allergy of newAllergies) {
                if (allergy.description.trim() !== '') {
                    const { error: allergiesError } = await supabase
                        .from('allergies')
                        .insert({
                            profile_id: userProfile?.id,
                            description: allergy.description
                        });

                    if (allergiesError) throw allergiesError;
                }
            }

            // Update profile completion flag
            const { error: profileError } = await supabase
                .from('users')
                .update({ is_completed: true })
                .eq('id', userProfile?.id);

            if (profileError) throw profileError;

            refreshUser();
            logger.log('[CompleteProfile Controller] Profile changes saved');

            Alert.alert(
                'Perfil completado',
                'Tu información ha sido guardada exitosamente.'
            );
        } catch (error) {
            logger.error('[CompleteProfile Controller] Error saving:', error);
            Alert.alert('Error', 'No se pudieron guardar los cambios. Intenta de nuevo.');
        }

    };

    return {
        userName,
        lastName,
        allergies,
        userPhoto,
        handleAllergyChange,
        handleRemoveAllergy,
        handleClearAllergy,
        handleAddAllergy,
        handleChangePhoto,
        handleCompleteProfile
    };
}
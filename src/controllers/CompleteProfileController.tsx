import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { UserAllergies } from '../models/userAllergiesModel';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { databaseService } from '../services/databaseService';

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

        if (userProfile?.photo_url) {
            setUserPhoto(userProfile.photo_url);
        }

        if (userAllergies && userAllergies.length > 0) {
            setAllergies(userAllergies);
        }

    }, [userProfile, userAllergies]);

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

    const deleteOldImage = async (imageUrl: string) => {
        try {
            const parts = imageUrl.split('/avatars/');
            if (parts.length < 2) return;
            
            const pathWithParams = parts[1];
            const path = pathWithParams.split('?')[0]; // Remove query params if any
            const decodedPath = decodeURIComponent(path);

            logger.log('[CompleteProfile Controller] Attempting to delete:', decodedPath);

            const { error } = await supabase.storage
                .from('avatars')
                .remove([decodedPath]);

            if (error) {
                logger.error('[CompleteProfile Controller] Error deleting old image:', error);
            } else {
                logger.log('[CompleteProfile Controller] Old image deleted successfully');
            }
        } catch (error) {
            logger.error('[CompleteProfile Controller] Exception deleting old image:', error);
        }
    };

    const uploadImage = async (uri: string): Promise<string | null> => {
        try {
            if (!userProfile?.id) return null;

            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();

            const fileExt = uri.split('.').pop();
            const fileName = `${userProfile.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, arrayBuffer as any, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            
            if (data) {
                return data.publicUrl;
            }
            return null;

        } catch (error) {
            logger.error('[CompleteProfile Controller] Error uploading image:', error);
            Alert.alert('Error', 'No se pudo subir la imagen.');
            return null;
        }
    };

    const handleChangePhoto = async () => {
        logger.log('[CompleteProfile Controller] Change profile photo');
        
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
                return;
            }

            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const photo = result.assets[0];
                setUserPhoto(photo.uri);
            }
        } catch (error) {
            logger.error('[CompleteProfile Controller] Error picking image:', error);
            Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
        }
    };

    const handleCompleteProfile = async () => {
        logger.log('[CompleteProfile Controller] Saving profile info...');

        
        // Validation: Check that there are no empty allergies
        const alphaRegex = /^[\p{L}\s]+$/u;

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

            let photoUrl = userProfile?.photo_url;

            // Check if photo has changed
            if (userPhoto && !userPhoto.startsWith('http')) {
                const uploadedUrl = await uploadImage(userPhoto);
                if (uploadedUrl) {
                    if (photoUrl && photoUrl.includes('avatars')) {
                        await deleteOldImage(photoUrl);
                    }
                    photoUrl = uploadedUrl;
                }
            }

            // Prepare new allergies
            const newAllergies = allergies.filter(a => a.id.startsWith('temp-'));

            // Insert new allergies in Supabase and collect their IDs
            const insertedAllergies = [];
            for (const allergy of newAllergies) {
                if (allergy.description.trim() !== '') {
                    const { data, error: allergiesError } = await supabase
                        .from('allergies')
                        .insert({
                            profile_id: userProfile?.id,
                            description: allergy.description
                        })
                        .select()
                        .single();

                    if (allergiesError) throw allergiesError;
                    if (data) insertedAllergies.push(data);
                }
            }

            // Update profile completion flag in Supabase
            const { error: profileError } = await supabase
                .from('users')
                .update({ 
                    is_completed: true,
                    photo_url: photoUrl
                })
                .eq('id', userProfile?.id);

            if (profileError) throw profileError;

            // Update local SQLite database
            if (userProfile) {
                const updatedProfile = {
                    ...userProfile,
                    is_completed: true,
                    photo_url: photoUrl
                };
                await databaseService.saveUserProfile(updatedProfile);

                // Save allergies to local database
                if (insertedAllergies.length > 0) {
                    await databaseService.saveUserAllergies(userProfile.id, insertedAllergies);
                }

                logger.log('[CompleteProfile Controller] Profile and allergies saved to local database');
            }

            refreshUser();
            logger.log('[CompleteProfile Controller] Profile changes saved');

            Alert.alert(
                'Perfil completado',
                'Tu información ha sido guardada exitosamente.'
            );
        } catch (error) {
            logger.error('[CompleteProfile Controller] Error saving:', error);
            const errorMessage = (error as any)?.message || 'No se pudieron guardar los cambios.';
            Alert.alert('Error', `${errorMessage}\n\nPor favor verifica tu conexión a internet e inténtalo de nuevo.`);
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
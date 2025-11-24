import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { UserAllergies } from '../models/userAllergiesModel';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';

export const useModifyProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const { userProfile, userAllergies, loading, refreshUser } = useUser();

    const { user, signOut } = useAuth()

    const [userName, setUserName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [allergies, setAllergies] = useState<UserAllergies[]>([]);
    const [deletedAllergyIds, setDeletedAllergyIds] = useState<string[]>([]);
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

        if (userProfile?.photo_url) {
            setUserPhoto(userProfile.photo_url);
        }

        if (userAllergies && userAllergies.length > 0) {
            setAllergies(userAllergies);
        }

        if (user?.email) {
            setEmail(user.email)
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
        const allergyToRemove = allergies[index];
        
        if (!allergyToRemove.id.startsWith('temp-')) {
            setDeletedAllergyIds([...deletedAllergyIds, allergyToRemove.id]);
        }
        
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

    const deleteOldImage = async (imageUrl: string, maxRetries: number = 3): Promise<boolean> => {
        const parts = imageUrl.split('/avatars/');
        if (parts.length < 2) return true; // No valid path to delete
        
        const pathWithParams = parts[1];
        const path = pathWithParams.split('?')[0];
        const decodedPath = decodeURIComponent(path);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.log(`[ModifyProfile Controller] Attempting to delete (attempt ${attempt}/${maxRetries}):`, decodedPath);

                const { error } = await supabase.storage
                    .from('avatars')
                    .remove([decodedPath]);

                if (!error) {
                    logger.log('[ModifyProfile Controller] Old image deleted successfully');
                    return true;
                }

                logger.error(`[ModifyProfile Controller] Error deleting old image (attempt ${attempt}/${maxRetries}):`, error);
                
                if (attempt < maxRetries) {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            } catch (error) {
                logger.error(`[ModifyProfile Controller] Exception deleting old image (attempt ${attempt}/${maxRetries}):`, error);
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }

        return false;
    };

    const handleSave = async () => {
        logger.log('[ModifyProfile Controller] Saving profile changes...');

        // Validation: Check for empty fields
        if (!userName.trim() || !lastName.trim() || !email.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
            return;
        }

        // Validation: Check regex for name and lastName (allowing spaces)
        const alphaRegex = /^[\p{L}\s]+$/u;

        if (!alphaRegex.test(userName)) {
            Alert.alert('Error', 'El nombre solo puede contener letras.');
            return;
        }

        if (!alphaRegex.test(lastName)) {
            Alert.alert('Error', 'El apellido solo puede contener letras.');
            return;
        }

        // Validation: Check that there are no empty allergies
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
            let oldImageDeletionFailed = false;

            // Check if photo has changed (is a local file URI)
            if (userPhoto && !userPhoto.startsWith('http')) {
                const uploadedUrl = await uploadImage(userPhoto);
                if (uploadedUrl) {
                    if (photoUrl && photoUrl.includes('avatars')) {
                        const deletionSuccess = await deleteOldImage(photoUrl);
                        if (!deletionSuccess) {
                            oldImageDeletionFailed = true;
                            logger.warn('[ModifyProfile Controller] Old image deletion failed after retries, proceeding with profile update');
                        }
                    }
                    photoUrl = uploadedUrl;
                    setUserPhoto(uploadedUrl);
                }
            }

            // Update user profile
            const { error: profileError } = await supabase
                .from('users')
                .update({
                    name: userName,
                    last_name: lastName,
                    photo_url: photoUrl
                })
                .eq('id', userProfile?.id);
            
            if (profileError) throw profileError;

            // Delete allergies that were removed by the user
            for (const allergyId of deletedAllergyIds) {
                const { error: deleteError } = await supabase
                    .from('allergies')
                    .delete()
                    .eq('id', allergyId);

                if (deleteError) throw deleteError;
            }

            // alergies
            const existingAllergies = allergies.filter(a => !a.id.startsWith('temp-'));
            const newAllergies = allergies.filter(a => a.id.startsWith('temp-'));

            // Update existing allergies
            for (const allergy of existingAllergies) {
                const { error: allergiesError } = await supabase
                    .from('allergies')
                    .update({ description: allergy.description })
                    .eq('id', allergy.id);
                
                if (allergiesError) throw allergiesError;
            }

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

            // Clear the deleted allergies list after successful save
            setDeletedAllergyIds([]);

            refreshUser();
            logger.log('[ModifyProfile Controller] Profile changes saved');

            const successMessage = oldImageDeletionFailed 
                ? 'Tu información ha sido actualizada exitosamente. Nota: La imagen anterior no pudo ser eliminada del almacenamiento.'
                : 'Tu información ha sido actualizada exitosamente.';

            Alert.alert(
                'Cambios guardados',
                successMessage,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    }
                ]
            );
        } catch (error) {
            logger.error('[ModifyProfile Controller] Error saving:', error);
            Alert.alert('Error', 'No se pudieron guardar los cambios. Intenta de nuevo.');
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
            logger.error('[ModifyProfile Controller] Error uploading image:', error);
            Alert.alert('Error', 'No se pudo subir la imagen.');
            return null;
        }
    };

    const handleChangePhoto = async () => {
        logger.log('[ModifyProfile Controller] Change profile photo');
        
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
                return;
            }

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
            logger.error('[ModifyProfile Controller] Error picking image:', error);
            Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
        }
    };

    const handleChangeEmail = async () => {
        logger.log('[ModifyProfile Controller] Changing email...');

        // Validation: Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
            return;
        }

        // Check if email is the same as before
        if (email === user?.email) {
            logger.log('[ModifyProfile Controller] Email is the same, no change needed');
            Alert.alert('Info', 'El correo electrónico es el mismo que el actual.');
            return;
        }

        try {
            const { error: authEmailError } = await supabase.auth.updateUser({
                email: email
            });
            
            if (authEmailError) throw authEmailError;

            logger.log('[ModifyProfile Controller] Email confirmation sent...');

            Alert.alert(
                'Se ha enviado un correo de confirmación',
                'Confirma en tu correo para autorizar el cambio.',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            await signOut()
                            logger.log('[ModifyProfile Controller] User signed out');
                        }
                    }
                ]
            );

        } catch (error) {
            logger.error('[ModifyProfile Controller] Error changing email:', error);
            Alert.alert('Error', 'No se pudo cambiar el correo. Intenta de nuevo.');
        }

    };

    const handleChangePassword = async () => {
        logger.log('[ModifyProfile Controller] Changing password...');
        
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos de contraseña.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Validate password strength
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasDigit = /\d/.test(newPassword);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

        if (!hasUppercase || !hasLowercase || !hasDigit || !hasSymbol) {
            Alert.alert(
                'Error',
                'La contraseña debe contener al menos:\n• Una letra mayúscula\n• Una letra minúscula\n• Un número\n• Un símbolo (!@#$%^&*, etc.)'
            );
            return;
        }

        try {
            
            if (!user?.email) {
                throw new Error('No se pudo obtener el correo del usuario');
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: oldPassword
            });

            if (signInError) {
                Alert.alert('Error', 'La contraseña actual es incorrecta.');
                return;
            }

            // Update password in Supabase Auth
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            logger.log('[ModifyProfile Controller] Password chanched');

            Alert.alert(
                'Contraseña actualizada',
                'Tu contraseña ha sido cambiada exitosamente.',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            setOldPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            await signOut()
                            logger.log('[ModifyProfile Controller] User signed out');
                        }
                    }
                ]
            );
        } catch (error) {
            logger.error('[ModifyProfile Controller] Error changing password:', error);
            Alert.alert('Error', 'No se pudo cambiar la contraseña. Intenta de nuevo.');
        }
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
        handleChangeEmail,
        handleChangePassword
    };
}
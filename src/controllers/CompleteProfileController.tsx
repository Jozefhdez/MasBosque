import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { logger } from '../utils/logger';

export const useCompleteProfileController = () => {
    const navigation = useNavigation<NavigationProp>();

    const [userName, setUserName] = useState('Juan Alfredo Peréz');
    const [allergies, setAllergies] = useState<string[]>(['Ibuprofeno', 'Abejas', 'Epinefrina']);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleAddAllergy = () => {
        setAllergies([...allergies, '']);
    };

    const handleRemoveAllergy = (index: number) => {
        setAllergies(allergies.filter((_, i) => i !== index));
    };

    const handleUpdateAllergy = (index: number, text: string) => {
        const updatedAllergies = [...allergies];
        updatedAllergies[index] = text;
        setAllergies(updatedAllergies);
    };

    const handleClearAllergy = (index: number) => {
        const updatedAllergies = [...allergies];
        updatedAllergies[index] = '';
        setAllergies(updatedAllergies);
    };

    const handleSelectImage = async () => {
        logger.log('[CompleteProfile Controller] Upload Image');
    };

    const handleGoSOS = async () => {
        logger.log('[CompleteProfile Controller] Go to SOS');
        navigation.navigate('SOS');
    };

    return {
        userName,
        allergies,
        profileImage,
        handleAddAllergy,
        handleRemoveAllergy,
        handleUpdateAllergy,
        handleClearAllergy,
        handleSelectImage,
        handleGoSOS
    };
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './Styles';

type Allergy = {
  id: string;
  value: string;
};

export default function CompleteProfile() {
  const router = useRouter();
  const [userName] = useState('Juan Alfredo Peréz');
  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: '1', value: 'Ibuprofeno' },
    { id: '2', value: 'Ateips' },
    { id: '3', value: 'Epinefrina' },
  ]);

const handleBack = () => {
      router.back();
    };
  const handleAddPhoto = () => {
    Alert.alert('Agregar foto', 'Funcionalidad de cámara/galería próximamente');
  };

  const handleRemoveAllergy = (id: string) => {
    setAllergies(allergies.filter(allergy => allergy.id !== id));
  };

  const handleAddAllergy = () => {
    const newId = (allergies.length + 1).toString();
    setAllergies([...allergies, { id: newId, value: '' }]);
  };

  const handleAllergyChange = (id: string, value: string) => {
    setAllergies(allergies.map(allergy =>
      allergy.id === id ? { ...allergy, value } : allergy
    ));
  };

  const handleContinue = () => {
    const validAllergies = allergies.filter(a => a.value.trim() !== '');

    if (validAllergies.length === 0) {
      Alert.alert('Atención', 'Por favor agrega al menos una alergia o medicamento contraindicado.');
      return;
    }

    console.log('Perfil completado:', { userName, allergies: validAllergies });
    router.replace('/sos');
  };

  return (
    <View style={styles.containerLogin}>
    {/* Header con botón de retroceso */}
      <View style={styles.headerLogo}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentComplete}
        contentContainerStyle={styles.scrollContainerComplete}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.userNameComplete}>{userName}</Text>
        <Text style={styles.sectionTitle}>Agregar foto de perfil</Text>

        <TouchableOpacity
          style={styles.header}
          onPress={handleAddPhoto}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <View style={styles.editIcon}>
              <Text style={styles.editIconText}>✏️</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Alergias o medicamento contraindicados</Text>

        <View style={styles.form}>
          {allergies.map((allergy) => (
            <View key={allergy.id} style={styles.allergyRow}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAllergy(allergy.id)}
              >
                <Text style={styles.removeIcon}>⊖</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.allergyInput}
                placeholder="Escribe aquí..."
                placeholderTextColor="#999"
                value={allergy.value}
                onChangeText={(text) => handleAllergyChange(allergy.id, text)}
              />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleAllergyChange(allergy.id, '')}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addAllergyButton}
            onPress={handleAddAllergy}
          >
            <Text style={styles.addIcon}>⊕</Text>
            <Text style={styles.addAllergyText}>Agregar alergia</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.loginButtonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

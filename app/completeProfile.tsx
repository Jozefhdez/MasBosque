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
    <View style={styles.container}>
    {/* Header con botón de retroceso */}
      <View style={styles.headerLogo}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.sectionTitle}>Agregar foto de perfil</Text>

        <TouchableOpacity
          style={styles.avatarContainer}
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

        <View style={styles.allergiesContainer}>
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
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  headerLogo: {
    width: '100%',
    flexDirection: 'row',       // Para que los elementos vayan en fila
    alignItems: 'center',       // Centra verticalmente el botón
    justifyContent: 'flex-start', // Lo alinea a la izquierda
    paddingHorizontal: '8%',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',   // Se asegura que quede hacia la izquierda
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
  },

  header: {
    backgroundColor: '#2C2C2C',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#D8D8D0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#D8D8D0',
  },
  editIconText: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#054324',
    marginBottom: 16,
  },
  allergiesContainer: {
    marginBottom: 32,
  },
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  removeIcon: {
    fontSize: 24,
    color: '#666',
  },
  allergyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: '#666',
  },
  addAllergyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 4,
  },
  addIcon: {
    fontSize: 24,
    color: '#2D5016',
    marginRight: 12,
  },
  addAllergyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2D5016',
  },
  continueButton: {
    backgroundColor: '#2D5016',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
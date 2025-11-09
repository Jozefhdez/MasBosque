import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './Styles';
import { supabase } from './lib/supabaseClient';

type Allergy = {
  id: string;
  value: string;
};

export default function CompleteProfile() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [allergies, setAllergies] = useState<Allergy[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.log('auth.getUser error:', error);
          Alert.alert('Error', 'No se pudo obtener el usuario actual.');
          return;
        }
        const authId = data.user.id;
        setProfileId(authId);

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('name,last_name')
          .eq('id', authId)
          .single();
        if (!profileError && profile) {
          setUserName(`${profile.name} ${profile.last_name}`.trim());
        }

        const { data: existingAllergies, error: allergiesError } = await supabase
          .from('allergies')
          .select('id, description')
          .eq('profile_id', authId);

        if (!allergiesError && existingAllergies && existingAllergies.length > 0) {
          setAllergies(existingAllergies.map(a => ({ id: a.id, value: a.description })));
          router.replace('/sos');
          return;
        }

        setAllergies([{ id: 'temp-1', value: '' }]);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

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

  const handleContinue = async () => {
    const validAllergies = allergies.filter(a => a.value.trim() !== '');

    if (validAllergies.length === 0) {
      Alert.alert(
        'Atención',
        'Por favor agrega al menos una alergia o medicamento contraindicado.'
      );
      return;
    }

    if (!profileId) {
      Alert.alert('Error','Usuario no disponible.');
      return;
    }

    const rows = validAllergies.map(a => ({
      profile_id: profileId,
      description: a.value.trim(),
    }));

    const { error } = await supabase.from('allergies').insert(rows);

    if (error) {
      console.log('Error al insertar alergias:', error);
      Alert.alert(
        'Error',
        'No se pudieron guardar tus alergias.\n\n' + JSON.stringify(error, null, 2)
      );
      return;
    }

    console.log('Perfil completado:', { userName, allergies: validAllergies });
    router.replace('/sos');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  return (
    <View style={styles.containerModify}>
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

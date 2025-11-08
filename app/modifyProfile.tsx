import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './Styles';

const ModifyProfile = () => {
    const [firstName, setFirstName] = useState('Juan Alfredo');
      const [lastName, setLastName] = useState('Peréz Gonzalez');
      const [email, setEmail] = useState('juafred@gmail.com');
      const [allergies, setAllergies] = useState<Allergy[]>([
        { id: '1', value: 'Ibuprofeno' },
        { id: '2', value: 'Ateips' },
        { id: '3', value: 'Epinefrina' },
      ]);
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState(null);

    // Navegación segura: verificar sesión al montar
    useEffect(() => {
      const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          // No hay sesión → enviar al inicio
          router.replace('/initial');
        } else {
          setUser(data.session.user);
        }
        setSessionChecked(true);
      };

      checkSession();

      // Escuchar cambios en sesión (logout o expiración)
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          router.replace('/initial');
        } else {
          setUser(session.user);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);

    // Mientras se valida sesión, mostrar loader
    if (!sessionChecked) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5016" />
        </View>
      );
    }

  const handleBack = () => {
    router.back();
  };

type Allergy = {
  id: string;
  value: string;
};


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAddPhoto = () => {
    Alert.alert('Agregar foto', 'Funcionalidad de cámara/galería próximamente');
  };

  const handleRemoveAllergy = (id: string) => {
    setAllergies(allergies.filter(allergy => allergy.id !== id));
  };

  const handleAddAllergy = () => {
    const newId = (Date.now()).toString();
    setAllergies([...allergies, { id: newId, value: '' }]);
  };

  const handleAllergyChange = (id: string, value: string) => {
    setAllergies(allergies.map(allergy =>
      allergy.id === id ? { ...allergy, value } : allergy
    ));
  };

  const handleSaveChanges = () => {
    // Validaciones
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const validAllergies = allergies.filter(a => a.value.trim() !== '');
    if (validAllergies.length === 0) {
      Alert.alert('Atención', 'Por favor agrega al menos una alergia o medicamento contraindicado.');
      return;
    }

    console.log('Guardar cambios:', { firstName, lastName, email, allergies: validAllergies });
    Alert.alert('Éxito', 'Cambios guardados correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleChangePassword = () => {
    // Validaciones de contraseña
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos de contraseña');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    console.log('Cambiar contraseña');
    Alert.alert('Éxito', 'Contraseña cambiada correctamente');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.containerModify}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />

      {/* Header con botón de retroceso */}
      <View style={styles.headerModify}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainerProfile}
        showsVerticalScrollIndicator={true}
      >
        {/* Avatar con botón de editar */}
        <TouchableOpacity
          style={styles.avatarContainerModify}
          onPress={handleAddPhoto}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            {/* Placeholder - aquí iría la imagen del usuario */}
            <View style={styles.editIconContainer}>
              <Text style={styles.eyeIcon}>✏️</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Campo Nombre(s) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre(s)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Nombre(s)"
              placeholderTextColor="#999"
            />
            {firstName.length > 0 && (
              <TouchableOpacity onPress={() => setFirstName('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Campo Apellido */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Apellido"
              placeholderTextColor="#999"
            />
            {lastName.length > 0 && (
              <TouchableOpacity onPress={() => setLastName('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Campo Correo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Correo"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sección de alergias */}
        <Text style={styles.sectionTitle}>Alergias o medicamento contraindicados</Text>

        <View style={styles.avatarContainer}>
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

          {/* Botón agregar alergia */}
          <TouchableOpacity
            style={styles.addAllergyButton}
            onPress={handleAddAllergy}
          >
            <Text style={styles.addIcon}>⊕</Text>
            <Text style={styles.addAllergyText}>Agregar alergia</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Guardar cambios */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSaveChanges}
        >
          <Text style={styles.loginButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Sección de cambio de contraseña */}

        {/* Contraseña anterior */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña anterior</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••••"
              placeholderTextColor="#999"
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Text style={styles.eyeIcon}>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nueva contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••••"
              placeholderTextColor="#999"
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Text style={styles.eyeIcon}>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Repetir nueva contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Repetir nueva contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••••"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIcon}>👁️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón Cambiar contraseña */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.loginButtonText}>Cambiar contraseña</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ModifyProfile;
import React, { useEffect, useState } from 'react';
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
import { supabase } from './lib/supabaseClient';

const ModifyProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  // Cargar perfil del usuario
  const loadProfile = async (uid: string) => {
    try {
      // Perfil (nombre y apellido)
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('name,last_name')
        .eq('id', uid)
        .single();
      if (!profileError && profile) {
        setFirstName(profile.name || '');
        setLastName(profile.last_name || '');
      }

      // Correo desde auth
      const { data: authData } = await supabase.auth.getUser();
      setEmail(authData?.user?.email || '');

      // Alergias
      const { data: al, error: alError } = await supabase
        .from('allergies')
        .select('id, description')
        .eq('profile_id', uid);
      if (!alError && al) {
        setAllergies(al.map(a => ({ id: a.id, value: a.description })));
      } else {
        setAllergies([]);
      }
    } catch (e) {
      console.log('Error loading profile in modifyProfile:', e);
    }
  };

  // Verificar sesión y cargar datos
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace('/initial');
      } else {
        setUser(data.session.user);
        await loadProfile(data.session.user.id);
      }
      setSessionChecked(true);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.replace('/initial');
      } else {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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

  const handleSaveChanges = async () => {
    if (!user) return;
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

    try {
      // Actualizar perfil (tabla users)
      const { error: updError } = await supabase
        .from('users')
        .update({ name: firstName.trim(), last_name: lastName.trim() })
        .eq('id', user.id);
      if (updError) throw updError;

      // Reemplazar alergias: eliminar e insertar
      const { error: delError } = await supabase
        .from('allergies')
        .delete()
        .eq('profile_id', user.id);
      if (delError) throw delError;

      const rows = validAllergies.map(a => ({
        profile_id: user.id,
        description: a.value.trim(),
      }));
      const { error: insError } = await supabase
        .from('allergies')
        .insert(rows);
      if (insError) throw insError;

      Alert.alert('Éxito', 'Cambios guardados correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      console.log('Error guardando cambios:', e);
      Alert.alert('Error', e?.message || 'No se pudieron guardar los cambios');
    }
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
   // 👉 Conditional rendering happens here, after all hooks
    if (!sessionChecked) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5016" />
        </View>
      );
    }

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
        contentContainerStyle={styles.scrollContainerModify}
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
              <TouchableOpacity onPress={() => handleRemoveAllergy(allergy.id)}>
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
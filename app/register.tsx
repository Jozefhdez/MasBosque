import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';

const validateName = (name: string) =>
  /^[A-Za-z]+$/.test(name.trim()) && name.trim() !== '';

const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) &&
  email.trim() !== '';

const validatePassword = (password: string) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[!@#$%^&*]/.test(password) &&
  password.trim() !== '';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allergies, setAllergies] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleBack = () => router.back();

  const handleTermsPress = () => {
    console.log('Abrir Acuerdo de usuario');
  };

  const handlePrivacyPress = () => {
    console.log('Abrir Política de privacidad');
  };

  const handleSignUp = async () => {
    setError('');

    if (!acceptedTerms) return alert('Debes aceptar los términos y condiciones');
    if (!validateName(firstName)) return alert('El nombre debe contener solo letras y no estar vacío.');
    if (!validateName(lastName)) return alert('El apellido debe contener solo letras y no estar vacío.');
    if (!validateEmail(email)) return alert('El correo electrónico no es válido.');
    if (!validatePassword(password)) return alert('La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.');
    if (!allergies.trim()) return alert('Por favor, ingresa tus alergias. Si no tienes ninguna, escribe "Ninguna".');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message);
        alert(authError.message);
        return;
      }

      if (authData?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              auth_id: authData.user.id, 
              email: email.trim(),
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              role: 'user',
            },
          ])
          .select()
          .single();

        if (userError) {
          console.error('Error al insertar usuario:', userError);
          throw userError;
        }

        console.debug('Usuario creado:', userData);

        // 3. Insertar alergias relacionadas con el usuario
        const { data: allergyData, error: allergiesError } = await supabase
          .from('allergies')
          .insert([
            {
              user_id: userData.id, // Usar el ID de la tabla users
              description: allergies.trim(),
            },
          ])
          .select()
          .single();

        if (allergiesError) {
          console.error('Error al insertar alergias:', allergiesError);
          throw allergiesError;
        }

        console.debug('Alergias registradas:', allergyData);
      }

      alert('¡Registro exitoso! Bienvenido/a ' + firstName);
      router.push('/completeProfile');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error inesperado');
      alert('Ocurrió un error inesperado. Intenta de nuevo.');
    }
  };

  const handleLoginRedirect = () => router.push('/login');

  const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />

      <View style={styles.headerLogo}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.logoPlus}>+</Text>
            <Text style={styles.logoBosque}>Bosque</Text>
          </Text>
          <Text style={styles.logoManu}>Manu</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre(s)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="..."
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              {firstName.length > 0 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setFirstName('')}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="..."
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              {lastName.length > 0 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setLastName('')}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alergias <Text style={styles.required}>(requerido)</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tus alergias o 'Ninguna'"
                placeholderTextColor="#999"
                value={allergies}
                onChangeText={setAllergies}
                multiline={true}
                numberOfLines={3}
              />
              {allergies.length > 0 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setAllergies('')}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="..."
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setEmail('')}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="..."
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {acceptedTerms && <View style={styles.checkboxFilled} />}
            </View>
            <Text style={styles.termsText}>
              He leído y estoy de acuerdo con el{' '}
              <Text style={styles.termsLink} onPress={handleTermsPress}>
                Acuerdo de usuario
              </Text>{' '}
              y{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                Política de privacidad
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  required: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '400',
  },
  headerLogo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: '8%',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
  },
  logoPlus: {
    color: '#2D5016',
    fontSize: 32,
    fontWeight: '700',
  },
  logoBosque: {
    color: '#2D5016',
    fontSize: 32,
    fontWeight: '700',
  },
  logoManu: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginTop: -8,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    padding: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: '#666',
  },
  eyeIcon: {
    fontSize: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2D5016',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D5016',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2D5016',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#2D5016',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    fontSize: 14,
    color: '#2D5016',
    fontWeight: '600',
  },
});

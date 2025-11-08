import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';
import styles from './Styles';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ✅ Redirigir si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/sos');
      }
    };
    checkSession();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleRegister = async () => {
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Guarda datos adicionales en tu tabla `users`
        const { error: insertError } = await supabase.from('users').insert([
          {
            user_id: data.user.id,
            name: firstName,
            last_name: lastName,
            role: 'user',
          },
        ]);

        if (insertError) {
          setError('Error guardando datos adicionales: ' + insertError.message);
          return;
        }
      }

      Alert.alert('Cuenta creada', 'Revisa tu correo para confirmar tu cuenta.');
      router.replace('/completeProfile');
    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error inesperado.');
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleTermsPress = () => {
    console.log('Abrir Acuerdo de usuario');
  };

  const handlePrivacyPress = () => {
    console.log('Abrir Política de privacidad');
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerModify}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      {/* Header con botón de retroceso */}
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
          {/* Campos de nombre y correo */}
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
                <TouchableOpacity style={styles.iconButton} onPress={() => setFirstName('')}>
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
                <TouchableOpacity style={styles.iconButton} onPress={() => setLastName('')}>
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
                <TouchableOpacity style={styles.iconButton} onPress={() => setEmail('')}>
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
              <TouchableOpacity style={styles.iconButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={handleLoginRedirect}>
            <Text style={styles.createAccountText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';
import styles from './Styles';

export default function Login(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

<<<<<<< HEAD
  // Navegación segura: redirigir si ya hay sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          // Si hay sesión activa, ir directamente a /sos
          router.replace('/sos');
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
      }
    };
    checkSession();
  }, []);

  const handleBack = (): void => {
    router.back();
  };

  const handleLogin = async (): Promise<void> => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
=======
  const handleLogin  = async () => {
    try {
      // Si ya hay sesión, decide la ruta por datos en BD
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.log('Error obteniendo sesión:', sessionError);
      }

      const user = sessionData?.session?.user;

      if (!user) {
        // Si no hay sesión, manda a registrarse o a un login completo con email/pass
        router.push('/register');
        return;
      }

      // Revisa si ya tiene alergias guardadas
      const { data: existingAllergies, error: allergiesError } = await supabase
        .from('allergies')
        .select('id')
        .eq('profile_id', user.id)
        .limit(1);

      if (!allergiesError && existingAllergies && existingAllergies.length > 0) {
        router.push('/sos');
      } else {
        router.push('/completeProfile');
      }
    } catch (e) {
      console.log('Fallo al decidir navegación post-login:', e);
      router.push('/completeProfile');
>>>>>>> bc8f473 (mmk)
    }
  }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/sos'); // navegación segura
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = (): void => {
    router.push('/register');
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo para restablecer la contraseña.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:19000/reset-password', // Cambia según tu deep link
      });

      if (error) {
        setError(error.message);
      } else {
        Alert.alert(
          'Correo enviado',
          'Revisa tu bandeja de entrada para restablecer la contraseña.'
        );
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerModify}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header con botón de retroceso */}
      <View style={styles.headerLogin}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.logoPlus}>+</Text>
            <Text style={styles.logoBosque}>Bosque</Text>
          </Text>
          <Text style={styles.logoManu}>Manu</Text>
        </View>

        {/* Saludo */}
        <Text style={styles.greeting}>Hola de nuevo !</Text>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Correo electrónico */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mostrar error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Link olvidaste contraseña */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón Iniciar Sesión */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={!loading ? handleLogin : undefined}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Aún no tienes cuenta? </Text>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createAccountText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

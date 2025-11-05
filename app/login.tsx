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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';

export default function Login(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleBack = (): void => {
    router.back();
  };

  const handleLogin = async (): Promise<void> => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
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
        router.push('/sos');
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header con botón de retroceso */}
      <View style={styles.headerLogo}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  headerLogo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: '8%',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backIcon: { fontSize: 28, color: '#000' },
  logo: { fontSize: 32, fontWeight: '700' },
  logoPlus: { color: '#2D5016', fontSize: 32, fontWeight: '700' },
  logoBosque: { color: '#2D5016', fontSize: 32, fontWeight: '700' },
  logoManu: { fontSize: 32, fontWeight: '700', color: '#000', marginTop: -8 },
  greeting: { fontSize: 28, fontWeight: '700', color: '#2D5016', marginBottom: 40 },
  form: { marginBottom: 32 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, height: 56 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  iconButton: { padding: 8 },
  eyeIcon: { fontSize: 20 },
  forgotPassword: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8, textDecorationLine: 'underline' },
  loginButton: { backgroundColor: '#2D5016', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: '#666' },
  createAccountText: { fontSize: 14, color: '#2D5016', fontWeight: '600' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 16 },
});

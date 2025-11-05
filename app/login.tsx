import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin  = async () => {
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) setError(error.message)
        else navigation.navigate('Home')
    }

  const handleCreateAccount = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    console.log('Olvidaste tu contraseña');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.3)" translucent />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoPlus}>+</Text>
              <Text style={styles.logoBosque}>Bosque</Text>
            </Text>
            <Text style={styles.logoManu}>Manu</Text>
          </View>

          {/* Botón Iniciar Sesión */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Botón Registrarse */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
  },
  logoPlus: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
  },
  logoBosque: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
  },
  logoManu: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -8,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2D5016',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#2D5016',
    fontSize: 16,
    fontWeight: '600',
  },
});
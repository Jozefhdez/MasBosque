import React, { useEffect, useState } from 'react';
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
import { supabase } from './lib/supabaseClient';
import styles from './Styles';

export default function Initial() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const handleLogin  = async () => {
    router.push('/login');
    }

  const handleCreateAccount = () => {
    router.push('/register');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.containerInitial}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.3)" translucent />

        <ScrollView
          contentContainerStyle={styles.scrollContainerInitial}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoInitial}>
              <Text style={styles.logoPlusIntial}>+</Text>
              <Text style={styles.logoBosqueInitial}>Bosque</Text>
            </Text>
            <Text style={styles.logoManuInitial}>Manu</Text>
          </View>

          {/* Botón Iniciar Sesión */}
          <TouchableOpacity
            style={styles.loginButtonInitial}
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

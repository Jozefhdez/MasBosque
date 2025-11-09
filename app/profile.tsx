import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';
import styles from './Styles';

const Profile = () => {
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

  // Fetch user profile when session is checked
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user.id)
            .single();
          setProfile(data);
        }
      };

  const handleBack = () => {
    router.back();
  };

  const handleEditInfo = () => {
    router.push('/modifyProfile');
  };

  const handleCloseSession = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              console.log('Sesión cerrada correctamente');
              router.replace('/login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error.message);
              Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta nuevamente.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Tu cuenta será eliminada a la brevedad.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Obtener usuario actual
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              if (userError || !user) throw new Error('No se pudo obtener el usuario actual');

              // Registrar la solicitud
              const { error: insertError } = await supabase
                .from('account_deletion_requests')
                .insert({ user_id: user.id });

              if (insertError) throw insertError;

              // Cerrar sesión
              await supabase.auth.signOut();

              // Avisar al usuario
              Alert.alert('Cuenta en proceso de eliminación', 'Tu cuenta será eliminada a la brevedad.');
              router.replace('/login');
            } catch (error) {
              console.error('Error al solicitar eliminación:', error.message);
              Alert.alert('Error', 'No se pudo solicitar la eliminación. Intenta nuevamente.');
            }
          },
        },
      ]
    );
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Botón de retroceso */}
      <View style={styles.headerProfile}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainerProfile}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar circular */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400' }}
            style={styles.avatarProfile}
          />
        </View>

        {/* Nombre del usuario */}
        <Text style={styles.userNameProfile}>
          {user?.user_metadata?.full_name || 'Usuario sin nombre'}
        </Text>

        {/* Información de alergias */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Alergias o contraindicaciones:</Text>
          <Text style={styles.allergyItem}>• Ibuprofeno</Text>
          <Text style={styles.allergyItem}>• Aspirina</Text>
          <Text style={styles.allergyItem}>• Epinefrina</Text>
        </View>

        {/* Botones de acción */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEditInfo}
        >
          <Text style={styles.loginButtonText}>Modificar información</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleCloseSession}
        >
          <Text style={styles.loginButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.outlineButtonText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

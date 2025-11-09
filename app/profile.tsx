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
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>([]);

  // Función separada para cargar datos del perfil
  const loadUserProfile = async (userId: string) => {
    try {
      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('name,last_name')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      } else if (profile) {
        const fullName = `${profile.name || ''} ${profile.last_name || ''}`.trim();
        console.log('Profile loaded:', fullName);
        setUserName(fullName);
      } else {
        console.log('No profile found for user:', userId);
      }

      // Fetch allergies
      const { data: al, error: allergiesError } = await supabase
        .from('allergies')
        .select('description')
        .eq('profile_id', userId);
      
      if (allergiesError) {
        console.error('Error fetching allergies:', allergiesError);
      } else if (al) {
        setAllergies(al.map(x => x.description));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace('/initial');
      } else {
        setUser(data.session.user);
        await loadUserProfile(data.session.user.id);
      }
      setSessionChecked(true);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.replace('/initial');
      } else {
        setUser(session.user);
        // Solo recargar datos si cambió el usuario, no en cada evento
        if (session.user.id !== user?.id) {
          await loadUserProfile(session.user.id);
        }
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

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
            } catch (error: any) {
              console.error('Error al cerrar sesión:', error?.message || error);
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
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              if (userError || !user) throw new Error('No se pudo obtener el usuario actual');

              const { error: insertError } = await supabase
                .from('account_deletion_requests')
                .insert({ user_id: user.id });

              if (insertError) throw insertError;

              await supabase.auth.signOut();

              Alert.alert('Cuenta en proceso de eliminación', 'Tu cuenta será eliminada a la brevedad.');
              router.replace('/initial');
            } catch (error: any) {
              console.error('Error al solicitar eliminación:', error?.message || error);
              Alert.alert('Error', 'No se pudo solicitar la eliminación. Intenta nuevamente.');
            }
          },
        },
      ]
    );
  };

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
          {userName || 'Usuario'}
        </Text>

        {/* Información de alergias */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Alergias o contraindicaciones:</Text>
          {allergies.length === 0 ? (
            <Text style={styles.allergyItem}>• Ninguna</Text>
          ) : (
            allergies.map((a, idx) => (
              <Text key={idx} style={styles.allergyItem}>• {a}</Text>
            ))
          )}
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

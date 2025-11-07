import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';

const Profile = () => {
    const router = useRouter();

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
                router.replace('/login'); // Redirige al login
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

    return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar circular */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400' }}
            style={styles.avatar}
          />
        </View>

        {/* Nombre del usuario */}
        <Text style={styles.userName}>Juan Alfredo Pérez Gonzalez</Text>

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
          <Text style={styles.primaryButtonText}>Modificar información</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleCloseSession}
        >
          <Text style={styles.dangerButtonText}>Cerrar sesión</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 40,
        color: '#000',
    },
    scrollContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 24,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    userName: {
        fontSize: 25,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 32,
    },
    infoContainer: {
        width: '100%',
        marginBottom: 40,
    },
    infoText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
        marginBottom: 12,
    },
    allergyItem: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
        marginBottom: 6,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#2D5016',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerButton: {
        width: '100%',
        backgroundColor: '#A63C3C',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    dangerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#A63C3C',
    },
    outlineButtonText: {
        color: '#A63C3C',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Profile;
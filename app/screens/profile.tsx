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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Profile = ({ navigation }: Props) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditInfo = () => {
    // Navegar a pantalla de edición
    navigation.navigate('ModifyProfile');
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
          onPress: () => {
            console.log('Sesión cerrada');
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            console.log('Cuenta eliminada');
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />

      {/* Header con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {/* Aquí puedes usar una imagen real del usuario */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400' }}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* Nombre del usuario */}
        <Text style={styles.userName}>Juan Alfredo Peréz Gonzalez</Text>

        {/* Información de alergias/condiciones */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Alergias o contraindicaciones:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Ibuprofeno</Text>
            <Text style={styles.listItem}>• Aspirina</Text>
            <Text style={styles.listItem}>• Epinefrina</Text>
            <Text style={styles.listItem}>• ...</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          {/* Botón Modificar información */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleEditInfo}
          >
            <Text style={styles.primaryButtonText}>Modificar información</Text>
          </TouchableOpacity>

          {/* Botón Cerrar sesión */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCloseSession}
          >
            <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>

          {/* Botón Eliminar cuenta */}
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Eliminar cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
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
    fontSize: 28,
    color: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: '#E8E8E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'left',
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  listContainer: {
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2D5016',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#A63C3C',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A63C3C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A63C3C',
  },
  dangerButtonText: {
    color: '#A63C3C',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
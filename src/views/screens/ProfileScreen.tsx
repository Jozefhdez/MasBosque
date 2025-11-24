import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useProfileController } from '../../controllers/ProfileController';
import { BackChevronIcon } from '../components/Icon';

export default function ProfileScreen() {

  const [imageError, setImageError] = useState(false);

  const {
    userName,
    userPhoto,
    allergies,
    handleGoBack,
    handleGoModifyProfile,
    handleSignOut,
    handleDeleteAccount
  } = useProfileController();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFAFA" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <BackChevronIcon
            size={32}
            color='#000'
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.avatarContainer}>
          {userPhoto && !imageError ? (
            <Image 
              source={{ uri: userPhoto }} 
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {userName ? userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.userName}>
          {userName || 'Usuario'}
        </Text>

        <View style={styles.allergiesContainer}>
          <Text style={styles.allergiesTitle}>
            Alergias o contraindicaciones:
          </Text>
          {allergies && allergies.length > 0 ? (
            allergies.map((allergy) => (
              <Text key={allergy.id} style={styles.allergyItem}>
                • {allergy.description}
              </Text>
            ))
          ) : (
            <Text style={styles.allergyItem}>
              • Ninguna
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.modifyProfileButton}
          onPress={handleGoModifyProfile}
        >
          <Text style={styles.modifyProfileText}>Modificar Información</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
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
    alignItems: 'flex-start',
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
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  avatarPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#003706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    color: '#FFFAFA',
  },
  userName: {
    fontSize: 26,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  allergiesContainer: {
    width: '100%',
    marginBottom: 40,
  },
  allergiesTitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  allergyItem: {
    fontSize: 18,
    fontFamily: 'IBMPlexSansDevanagari-Regular',
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  modifyProfileButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#003706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  modifyProfileText: {
    color: '#FFFAFA',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
  signOutButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#BB0003',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  signOutText: {
    color: '#FFFAFA',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
  deleteButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#FFFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#BB0003',
  },
  deleteButtonText: {
    color: '#BB0003',
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    fontSize: 16,
  },
});
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { useCompleteProfileController } from '../../controllers/CompleteProfileController';
import { Ionicons } from '@expo/vector-icons';
import { Pencil, PlusCircle, UserIcon } from '../components/Icon';
import AllergyItem from '../components/AllergyItem';

export default function CompleteProfileScreen() {
  const [imageError, setImageError] = useState(false);

  const {
    userName,
    lastName,
    allergies,
    userPhoto,
    handleAllergyChange,
    handleRemoveAllergy,
    handleClearAllergy,
    handleAddAllergy,
    handleChangePhoto,
    handleCompleteProfile
  } = useCompleteProfileController();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      
      <Text style={styles.title}>
        {userName} {lastName}
      </Text>

      <Text style={styles.sectionTitle}>Agregar foto de perfil</Text>
      
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
            <UserIcon 
              size={60} 
              color="#FFFAFA" 
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.pencilIcon}
          onPress={handleChangePhoto}
        >
          <Pencil 
            size={28} 
            color="#003706" 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Alergias o medicamento contraindicados</Text>

      <View style={styles.allergiesList}>
        {allergies.map((allergy, index) => (
          <AllergyItem
            key={allergy.id}
            allergy={allergy.description}
            onRemove={() => handleRemoveAllergy(index)}
            onChangeText={(text) => handleAllergyChange(index, text)}
            onClear={() => handleClearAllergy(index)}
          />
        ))}

        <TouchableOpacity 
          style={styles.addAllergyButton}
          onPress={handleAddAllergy}
        >
          <PlusCircle
            size={24}
            color='#003706'
          />
          <Text style={styles.addAllergyText}>Agregar alergia</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.completeProfileButton}
        onPress={handleCompleteProfile}
        >
        <Text style={styles.completeProfileText}>
          Continuar
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    color: '#000',
    marginTop: 80,
    marginBottom: 40,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    color: '#003706',
    marginBottom: 25,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#003706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilIcon: {
    position: 'absolute',
    bottom: 0,
    right: '50%',
    marginRight: -90,
    backgroundColor: '#F2F0EF',
    borderRadius: 20,
    padding: 8,
  },
  allergiesList: {
    marginBottom: 40,
  },
  addAllergyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 8,
  },
  addAllergyText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    color: '#000',
    marginLeft: 16,
  },
  completeProfileButton: {
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
  completeProfileText: {
    color: '#e0e0e0',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
  signUpText: {
    color: '#003706',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
});
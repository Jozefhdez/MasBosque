import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useCompleteProfileController } from '../../controllers/CompleteProfileController';
import { Ionicons } from '@expo/vector-icons';
import { Pencil, PlusCircle } from '../components/Icon';
import AllergyItem from '../components/AllergyItem';

export default function CompleteProfileScreen() {

  const {
    userName,
    allergies,
    handleAddAllergy,
    handleRemoveAllergy,
    handleUpdateAllergy,
    handleClearAllergy,
    handleSelectImage,
    handleGoSOS
  } = useCompleteProfileController();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      
      <Text style={styles.title}>
        {userName}
      </Text>

      <Text style={styles.sectionTitle}>Agregar foto de perfil</Text>
      
      <TouchableOpacity 
        style={styles.photoButton}
        onPress={handleSelectImage}
      >
        <View style={styles.photoPlaceholder}>
          <Pencil
            size={48}
            color='#003706'
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Alergias o medicamento contraindicados</Text>

      <View style={styles.allergiesList}>
        {allergies.map((allergy, index) => (
          <AllergyItem
            key={index}
            allergy={allergy}
            onRemove={() => handleRemoveAllergy(index)}
            onChangeText={(text) => handleUpdateAllergy(index, text)}
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
        onPress={handleGoSOS}
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
  photoButton: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
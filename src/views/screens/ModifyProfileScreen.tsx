import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { useModifyProfileController } from '../../controllers/ModifyProfileController';
import { BackChevronIcon, Pencil, XIcon, PlusCircle, OpenEyeIcon, CloseEyeIcon } from '../components/Icon';
import AllergyItem from '../components/AllergyItem';

export default function ModifyProfileScreen() {
  const {
    userName,
    lastName,
    email,
    userPhoto,
    allergies,
    oldPassword,
    newPassword,
    confirmPassword,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    setUserName,
    setLastName,
    setEmail,
    setShowOldPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    handleGoBack,
    handleAllergyChange,
    handleRemoveAllergy,
    handleClearAllergy,
    handleAddAllergy,
    handleSave,
    handleChangePhoto,
    handleChangePassword
  } = useModifyProfileController();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <BackChevronIcon 
              size={32} 
              color="#000" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          {userPhoto ? (
            <Image 
              source={{ uri: userPhoto }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {userName ? userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
              </Text>
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

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre(s)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={userName}
                onChangeText={setUserName}
                keyboardType="default"
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
              {userName.length > 0 && (
                <TouchableOpacity onPress={() => setUserName('')}>
                  <XIcon 
                    size={20} 
                    color="#000" 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido(s)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={lastName}
                onChangeText={setLastName}
                keyboardType="default"
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
              {lastName.length > 0 && (
                <TouchableOpacity onPress={() => setLastName('')}>
                  <XIcon 
                    size={20} 
                    color="#000" 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={() => setEmail('')}>
                  <XIcon size={20} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={styles.label}>Alergias o medicamento contraindicados</Text>
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
              color="#003706" 
            />
            <Text style={styles.addAllergyText}>Agregar alergia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Password Section */}
        
        <View style={styles.passwordSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña anterior</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                {showOldPassword ? (
                  <OpenEyeIcon 
                    size={20} 
                    color="#000" 
                  />
                ) : (
                  <CloseEyeIcon 
                    size={20} 
                    color="#000" 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? (
                  <OpenEyeIcon 
                    size={20} 
                    color="#000" 
                  />
                ) : (
                  <CloseEyeIcon 
                    size={20} 
                    color="#000" 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Repetir nueva contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <OpenEyeIcon
                    size={20} 
                    color="#000" 
                  />
                ) : (
                  <CloseEyeIcon 
                    size={20} 
                    color="#000" 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity 
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.changePasswordButtonText}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
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
  avatarPlaceholderText: {
    fontSize: 48,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    color: '#FFFAFA',
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
  formSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginLeft: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F0EF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'IBMPlexSansDevanagari-Regular',
  },
  addAllergyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 8,
  },
  addAllergyText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    color: '#000',
    marginLeft: 16,
  },
  saveButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#003706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  saveButtonText: {
    color: '#FFFAFA',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  passwordSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  changePasswordButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#003706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  changePasswordButtonText: {
    color: '#FFFAFA',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
});
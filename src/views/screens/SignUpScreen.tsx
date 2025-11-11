import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useSignUpController } from '../../controllers/SignUpController';
import { OpenEyeIcon, CloseEyeIcon, XIcon } from '../components/Icon';

export default function SignUpScreen() {

  const {
    name,
    setName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    readTOS,
    setReadTOS,
    handleGoSignIn,
    handleGoCompleteProfile,
    handleTOS,
    handlePA
  } = useSignUpController();

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logoBosque}>+Bosque</Text>
          <Text style={styles.logoManu}>Manu</Text>
        </View>

        <View style={styles.form}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre(s)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={name}
                onChangeText={setName}
                keyboardType="default"
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
              {name.length > 0 && (
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setName('')}
                >
                  <XIcon
                    size={20}
                    color='black'
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
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setLastName('')}
                >
                  <XIcon
                    size={20}
                    color='black'
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
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
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setEmail('')}
                >
                  <XIcon
                    size={20}
                    color='black'
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder=". . ."
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <OpenEyeIcon
                    size={20}
                    color='black'
                  />
                : 
                  <CloseEyeIcon
                    size={20}
                    color='black'
                  />
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setReadTOS(!readTOS)}
          activeOpacity={0.7}
        >
          <View style={styles.checkbox}>
            {readTOS && <View style={styles.checkboxFilled} />}
          </View>
          <Text style={styles.termsText}>He leído y estoy de acuerdo con el{' '}
            <Text 
              style={styles.termsLink} 
              onPress={handleTOS}
            >
              Acuerdo de usuario
            </Text>
            {' '}y{' '}
            <Text 
              style={styles.termsLink} 
              onPress={handlePA}
            >
              Política de privacidad
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={handleGoCompleteProfile}
        >
          <Text style={styles.signUpText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ya tienes cuenta?  </Text>
        <TouchableOpacity 
          onPress={handleGoSignIn}
        >
          <Text style={styles.logInText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <StatusBar barStyle="dark-content"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 50,
    marginBottom: 50,
  },
  logoBosque: {
    color: '#003706',
    fontSize: 32,
    fontWeight: '700',
  },
  logoManu: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginTop: -8,
    paddingLeft: 90,
  },
  form: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
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
  iconButton: {
    padding: 8,
  },
  signUpButton: {
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
  signUpText: {
    color: '#e0e0e0',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFAFA',
  },
  footerText: {
    fontFamily: 'IBMPlexSansDevanagari-Regular',
    fontSize: 14,
    color: '#666',
  },
  logInText: {
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 14,
    color: '#003706',
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#003706',
    marginRight: 15,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: {
    width: 17,
    height: 17,
    borderRadius: 100,
    backgroundColor: '#003706',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  termsText: {
    fontFamily: 'IBMPlexSansDevanagari-Medium',
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#003706',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
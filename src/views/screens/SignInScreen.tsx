import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useSignInController } from '../../controllers/SignInController';
import { OpenEyeIcon, CloseEyeIcon, XIcon } from '../components/Icon';

export default function SignInScreen() {

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleGoSignUp,
    handleGoSOS,
    handleForgotPassword
  } = useSignInController();

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

        <Text style={styles.greeting}>Hola de nuevo!</Text>


        <View style={styles.form}>
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
            <TouchableOpacity
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPassword}>Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleGoSOS}
        >
          <Text style={styles.signInText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Aún no tienes cuenta?  </Text>
        <TouchableOpacity 
          onPress={handleGoSignUp}
        >
          <Text style={styles.createAccountText}>Crear Cuenta</Text>
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
  greeting: {
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 36,
    color: '#003706',
    marginBottom: 40,
    alignSelf: 'center',
  },
  form: {
    marginBottom: 32,
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
  iconButton: {
    padding: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  signInButton: {
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
  signInText: {
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
  createAccountText: {
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 14,
    color: '#003706',
  },
});
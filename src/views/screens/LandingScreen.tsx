import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, } from 'react-native';
import { LandingController } from '../../controllers/LandingController';

export default function LandingScreen() {

  const {
    handleGoSignIn,
    handleGoSignUp
  } = LandingController();

  return (
    <ImageBackground
      source={require('../../../assets/images/background_image.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoBosque}>
            +Bosque
          </Text>
          <Text style={styles.logoManu}>
            Manu
          </Text>
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleGoSignIn}
          >
          <Text style={styles.signInText}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleGoSignUp}
          >
          <Text style={styles.signUpText}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  logoBosque: {
    fontSize: 50,
    fontWeight: '700',
    marginLeft: -30,
    color: '#003706',
    fontFamily: 'IBMPlexSansDevanagari-Bold',
  },
  logoManu: {
    fontSize: 50,
    fontWeight: '700',
    color: '#000000',
    marginTop: -20,
    alignSelf: 'flex-end',
    marginRight: -30,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
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
    alignItems: 'center'
  },
  signUpButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginBottom: 30,
    width: '90%',
    alignItems: 'center'
  },
  signInText: {
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
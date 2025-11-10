import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SignUpController } from '../../controllers/SignUpController';

export default function SignUpScreen() {

  const {
    handleGoSignIn,
    handleGoCompleteProfile
  } = SignUpController();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign Up Screen</Text>
      <Text style={styles.subTitle}>User will Sign Up</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoSignIn}
      >
        <Text>Already have account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoCompleteProfile}
      >
        <Text>Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20,
  },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    color: '#000',
    marginTop: 50,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'IBMPlexSansDevanagari-Regular',
    color: '#666',
    marginBottom: 30,
  },
});
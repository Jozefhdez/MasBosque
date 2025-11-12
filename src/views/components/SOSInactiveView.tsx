import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { SOSButton, SOSButtonDesign } from './Icon';
import { SOSInactiveViewProps } from '../../models/SOSInactiveViewProps';

export default function SOSInactiveView({ 
  userName, 
  userPhoto, 
  isConnected, 
  onProfilePress,
  onSOSPress 
}: SOSInactiveViewProps) {
    
  return (
    <View style={styles.container}>
      <Text style={styles.sosTitle}>SOS</Text>
      
      <TouchableOpacity 
        style={styles.hexagonButton}
        onPress={onSOSPress}
        activeOpacity={0.8}
      >
        <SOSButton size={250} />
        <View style={styles.designOverlay}>
          <SOSButtonDesign size={150} />
        </View>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? '#06C000' : '#BB0003' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Conectado a la red' : 'Sin conexión'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.userCard}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.userPhotoContainer}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
          ) : (
            <View style={styles.userPhotoPlaceholder}>
              <Text style={styles.userPhotoPlaceholderText}>
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 40,
  },
  sosTitle: {
    fontFamily: 'IBMPlexSansDevanagari-Bold',
    fontSize: 96,
    color: '#BB0003',
    letterSpacing: 8,
  },
  hexagonButton: {
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 100,
    marginRight: 10,
  },
  statusText: {
    fontFamily: 'IBMPlexSansDevanagari-Medium',
    fontSize: 18,
    color: '#333',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '85%',
    maxWidth: 400,
  },
  userPhotoContainer: {
    marginRight: 16,
  },
  userPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPhotoPlaceholderText: {
    fontFamily: 'IBMPlexSansDevanagari-Medium',
    color: '#FFFAFA',
    fontSize: 18,
  },
  userName: {
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    fontSize: 20,
    color: '#000',
    flex: 1,
  },
});

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { SOSButton, SOSButtonDesign } from './Icon';
import { SOSInactiveViewProps } from '../../models/SOSInactiveViewProps';

export default function SOSInactiveView({ 
  userName, 
  userPhoto, 
  isConnected, 
  onProfilePress,
  onSOSPress 
}: SOSInactiveViewProps) {
    
  const [imageError, setImageError] = useState(false);

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

      <TouchableOpacity 
        style={styles.userCard}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.userPhotoContainer}>
          {userPhoto && !imageError ? (
            <Image 
              source={{ uri: userPhoto }} 
              style={styles.userPhoto}
              contentFit="cover"
              transition={1000}
              cachePolicy="memory-disk"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.userPhotoPlaceholder}>
              <Text style={styles.userPhotoPlaceholderText}>
                {userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
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
    marginTop: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
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

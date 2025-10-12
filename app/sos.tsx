import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

const SOS = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const pulseAnim = new Animated.Value(1);

  // Animación de pulso continuo para el botón
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleSOSPress = () => {
    if (isSOSActive) {
      // Si ya está activo, no hacer nada (debe cancelarse con el botón)
      return;
    }

    // Animación de presión
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Activar estado SOS
    setIsSOSActive(true);
    console.log('¡ALERTA SOS ACTIVADA!');
  };

  const handleCancelSOS = () => {
    setIsSOSActive(false);
    console.log('Alerta SOS cancelada');
  };

  return (
    <View style={[styles.container, isSOSActive && styles.containerActive]}>
      <StatusBar
        barStyle={isSOSActive ? "light-content" : "dark-content"}
        backgroundColor={isSOSActive ? "#A63C3C" : "#F5F5F0"}
      />

      {/* Título SOS */}
      <Text style={[styles.title, isSOSActive && styles.titleActive]}>SOS</Text>

      {/* Botón SOS con animación */}
      <View style={styles.buttonContainer}>
        {!isSOSActive && (
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSOSPress}
          style={styles.sosButtonWrapper}
        >
          <Animated.View
            style={[
              styles.sosButton,
              isSOSActive && styles.sosButtonActive,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Círculos concéntricos */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />
            <View style={styles.centerDot} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Mensaje de estado */}
      {isSOSActive ? (
        <Text style={styles.statusMessage}>Pidiendo ayuda</Text>
      ) : (
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isConnected && styles.statusDotActive]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Conectado a la red' : 'Sin conexión'}
          </Text>
        </View>
      )}

      {/* Información del usuario o botón cancelar */}
      {isSOSActive ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelSOS}
          activeOpacity={0.8}
        >
          <View style={styles.cancelCircle} />
          <Text style={styles.cancelButtonText}>Desliza para cancelar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.userContainer}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarEmoji}>🌳</Text>
            </View>
          </View>
          <Text style={styles.userName}>Juan Alfredo Peréz</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    paddingTop: 60,
  },
  containerActive: {
    backgroundColor: '#A63C3C',
  },
  title: {
    fontSize: 64,
    fontWeight: '700',
    color: '#A63C3C',
    letterSpacing: 8,
    marginBottom: 60,
  },
  titleActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#A63C3C',
    opacity: 0.1,
  },
  sosButtonWrapper: {
    shadowColor: '#A63C3C',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  sosButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#A63C3C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sosButtonActive: {
    backgroundColor: '#8B2F2F',
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  circle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  circle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCC',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 100,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cancelCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E8E0',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default SOS;
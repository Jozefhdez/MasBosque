import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';
import Svg, { Polygon, Circle, Defs, Filter, FeGaussianBlur, FeOffset } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient'


export default function SOS() {
    const router = useRouter();
    const [isSOSActive, setIsSOSActive] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isSOSActive) {
          const pulse = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.1,
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
        }
    }, [isSOSActive]);

    const handleSOSPress = () => {
        if (isSOSActive) return;

        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        setIsSOSActive(true);
    };

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase.from('users').select('*').eq('user_id', user.id).single()
        setProfile(data)
      }
    }

    const handleProfile =()=>{
      router.push('/profile');
    };

    const handleBack = () => {
      router.back();
    };

    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx > 0 && gestureState.dx < 200) {
              slideAnim.setValue(gestureState.dx);
            }
          },
          onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > 150) {
              Animated.timing(slideAnim, {
                toValue: 220,
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                setIsSOSActive(false);
                slideAnim.setValue(0);
              });
            } else {
              Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          },
        })
    ).current;

    // Función para calcular puntos del hexágono
    const getHexagonPoints = (centerX: number, centerY: number, radius: number) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 2; // Rotado 90° para punta arriba
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    const AnimatedSvg = Animated.createAnimatedComponent(Svg);

    return (
      <View style={[styles.container, isSOSActive && styles.containerActive]}>
        <StatusBar
          barStyle={isSOSActive ? "light-content" : "dark-content"}
          backgroundColor={isSOSActive ? "#B73239" : "#FFFFFF"}
        />
        {/* Botón de retroceso */}
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
        </View>

        {/* SOS Title */}
        <Text style={[styles.sosTitle, isSOSActive && styles.sosTitleActive]}>
          SOS
        </Text>

        {/* SOS Button - Hexagon Shape */}
        <View style={styles.sosContainer}>
          <Animated.View
            style={[
              styles.hexagonWrapper,
              { transform: [{ scale: isSOSActive ? 1 : pulseAnim }] }
            ]}
          >
            <TouchableOpacity
              onPress={handleSOSPress}
              activeOpacity={0.8}
              disabled={isSOSActive}
              style={styles.hexagonButton}
            >
              <AnimatedSvg width="300" height="300" viewBox="0 0 300 300">
                <Defs>
                  <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeOffset result="offOut" in="SourceAlpha" dx="0" dy="8" />
                    <FeGaussianBlur result="blurOut" in="offOut" stdDeviation="15" />
                  </Filter>
                </Defs>

                {/* Sombra del hexágono */}
                <Polygon
                  points={getHexagonPoints(150, 150, 120)}
                  fill="rgba(0,0,0,0.25)"
                  filter="url(#shadow)"
                />

                {/* Hexágono principal */}
                <Polygon
                  points={getHexagonPoints(150, 150, 120)}
                  fill={isSOSActive ? "#8B2630" : "#B73239"}
                />

                {/* Círculos concéntricos */}
                <Circle cx="150" cy="150" r="85" fill="none" stroke="#FFFFFF" strokeWidth="4" />
                <Circle cx="150" cy="150" r="55" fill="none" stroke="#FFFFFF" strokeWidth="4" />
                <Circle cx="150" cy="150" r="22" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              </AnimatedSvg>
            </TouchableOpacity>
          </Animated.View>

          {isSOSActive && (
            <Text style={styles.helpText}>Pidiendo ayuda</Text>
          )}
        </View>

        {/* Bottom Section */}
        {!isSOSActive ? (
          <View style={styles.bottomSection}>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Conectado a la red</Text>
            </View>

            <TouchableOpacity
              style={styles.userCard}
              onPress={handleProfile} // <- función que se ejecuta al presionar
            >
              <View style={styles.userAvatar}>
              </View>
              <Text style={styles.userName}>{profile?.name || user?.name || 'Usuario'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.sliderThumb,
                  {
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <View style={styles.sliderCircle} />
              </Animated.View>
              <Text style={styles.sliderText}>Desliza para cancelar</Text>
            </View>
          </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 80,
  },
    header: {
      width: '100%',
      flexDirection: 'row',       // Para que los elementos vayan en fila
      alignItems: 'center',       // Centra verticalmente el botón
      justifyContent: 'flex-start', // Lo alinea a la izquierda
      paddingHorizontal: '8%',
      paddingTop: '5%',
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',   // Se asegura que quede hacia la izquierda
    },
    backIcon: {
      fontSize: 28,
      color: '#000',
    },

  containerActive: {
    backgroundColor: '#B73239',
  },
  sosTitle: {
    fontSize: 64,
    fontWeight: '800',
    color: '#B73239',
    letterSpacing: 8,
    marginBottom: 40,
  },
  sosTitleActive: {
    color: '#FFFFFF',
  },
  sosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonButton: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 40,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '85%',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B9D6F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  sliderTrack: {
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    justifyContent: 'center',
    paddingHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderThumb: {
    position: 'absolute',
    left: 8,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#B73239',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sliderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginLeft: 20,
  },
});
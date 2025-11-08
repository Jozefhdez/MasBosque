import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import Svg, { Polygon, Circle, Defs, Filter, FeGaussianBlur, FeOffset } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabaseClient';
import styles from './Styles';

export default function SOS() {
  const router = useRouter();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Session check effect
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace('/initial');
      } else {
        setUser(data.session.user);
      }
      setSessionChecked(true);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/initial');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Pulse animation effect (always declared)
  useEffect(() => {
    if (!isSOSActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isSOSActive]);

  // Fetch user profile when session is checked
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(data);
    }
  };

  const handleProfile = () => {
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

  const getHexagonPoints = (centerX, centerY, radius) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  // Handle SOS button press
  const handleSOSPress = () => {
    if (isSOSActive) return; // Prevent multiple presses while SOS is active

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

    setIsSOSActive(true); // Set SOS active
  };

  // 👉 Conditional rendering happens here, after all hooks
  if (!sessionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5016" />
      </View>
    );
  }

  return (
    <View style={[styles.containerSos, isSOSActive && styles.containerActive]}>
      <StatusBar
        barStyle={isSOSActive ? 'light-content' : 'dark-content'}
        backgroundColor={isSOSActive ? '#B73239' : '#FFFFFF'}
      />

      <View style={styles.headerLogo}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sosTitle, isSOSActive && styles.sosTitleActive]}>
        SOS
      </Text>

      <View style={styles.sosContainer}>
        <Animated.View
          style={[
            styles.hexagonWrapper,
            { transform: [{ scale: isSOSActive ? 1 : pulseAnim }] },
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

              <Polygon
                points={getHexagonPoints(150, 150, 120)}
                fill="rgba(0,0,0,0.25)"
                filter="url(#shadow)"
              />

              <Polygon
                points={getHexagonPoints(150, 150, 120)}
                fill={isSOSActive ? '#8B2630' : '#B73239'}
              />

              <Circle cx="150" cy="150" r="85" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              <Circle cx="150" cy="150" r="55" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              <Circle cx="150" cy="150" r="22" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            </AnimatedSvg>
          </TouchableOpacity>
        </Animated.View>

        {isSOSActive && <Text style={styles.helpText}>Pidiendo ayuda</Text>}
      </View>

      {!isSOSActive ? (
        <View style={styles.bottomSection}>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Conectado a la red</Text>
          </View>

          <TouchableOpacity style={styles.userCard} onPress={handleProfile}>
            <View style={styles.userAvatar} />
            <Text style={styles.userName}>
              {profile?.name || user?.name || 'Usuario'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.sliderThumb, { transform: [{ translateX: slideAnim }] }]}
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

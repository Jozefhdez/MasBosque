import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { BluetoothProvider } from './src/contexts/BluetoothContext';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry for error tracking
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
});

function App() {

  const [loaded, error] = useFonts({
    'IBMPlexSansDevanagari-Thin': require('./assets/fonts/IBMPlexSansDevanagari-Thin.ttf'),
    'IBMPlexSansDevanagari-ExtraLight': require('./assets/fonts/IBMPlexSansDevanagari-ExtraLight.ttf'),
    'IBMPlexSansDevanagari-Light': require('./assets/fonts/IBMPlexSansDevanagari-Light.ttf'),
    'IBMPlexSansDevanagari-Regular': require('./assets/fonts/IBMPlexSansDevanagari-Regular.ttf'),
    'IBMPlexSansDevanagari-Medium': require('./assets/fonts/IBMPlexSansDevanagari-Medium.ttf'),
    'IBMPlexSansDevanagari-SemiBold': require('./assets/fonts/IBMPlexSansDevanagari-SemiBold.ttf'),
    'IBMPlexSansDevanagari-Bold': require('./assets/fonts/IBMPlexSansDevanagari-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  
  return (
    <AuthProvider>
      <UserProvider>
        <LocationProvider>
          <BluetoothProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <AppNavigator />
              <StatusBar />
            </GestureHandlerRootView>
          </BluetoothProvider>
        </LocationProvider>
      </UserProvider>
    </AuthProvider>
  );
}

// Wrap App with Sentry
export default Sentry.wrap(App);
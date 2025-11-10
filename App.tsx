import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigation';

export default function App() {

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
    <>
      <AppNavigator />
      <StatusBar />
    </>
  );
}
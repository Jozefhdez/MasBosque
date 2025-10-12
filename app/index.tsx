import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige automáticamente al login cuando se inicia la app
  return <Redirect href="./screens/login" />;
}
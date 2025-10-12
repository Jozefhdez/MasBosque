import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Registrarse',
        }}
      />
      <Stack.Screen
        name="sos"
        options={{
          title: 'Emergencia SOS',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
      <Stack.Screen
        name="completeProfile"
        options={{
          title: 'Completar Perfil',
        }}
      />
      <Stack.Screen
        name="modifyProfile"
        options={{
          title: 'Modificar Perfil',
        }}
      />
    </Stack>
  );
}
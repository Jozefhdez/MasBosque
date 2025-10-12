import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import SOS from './screens/SOS';
import Profile from './screens/Profile';
import CompleteProfile from './screens/CompleteProfile';
import ModifyProfile from './screens/ModifyProfile';

// Define los tipos de navegación para TypeScript
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SOS: undefined;
  Profile: undefined;
  CompleteProfile: undefined;
  ModifyProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta el header en todas las pantallas
          animation: 'slide_from_right', // Animación de transición
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Iniciar Sesión',
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: 'Registrarse',
          }}
        />
        <Stack.Screen
          name="SOS"
          component={SOS}
          options={{
            title: 'Emergencia SOS',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Perfil',
          }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfile}
          options={{
            title: 'Completar Perfil',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
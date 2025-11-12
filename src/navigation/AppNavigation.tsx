import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from '../models/RootParamsListModel';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import LandingScreen from '../views/screens/LandingScreen';
import SignInScreen from '../views/screens/SignInScreen';
import SignUpScreen from '../views/screens/SignUpScreen';
import CompleteProfileScreen from '../views/screens/CompleteProfileScreen';
import ProfileScreen from '../views/screens/ProfileScreen';
import ModifyProfileScreen from '../views/screens/ModifyProfileScreen';
import SOSScreen from '../views/screens/SOSScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {

    const { user, loading: authLoading } = useAuth();
    const { userProfile, loading: userLoading } = useUser();

    if (authLoading || userLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#003706" />
            </View>
        );
    }

    // Determine initial route based on user authentication and profile completion
    const getInitialRoute = () => {
        if (!user) return "Landing";
        if (userProfile && !userProfile.is_completed) return "CompleteProfile";
        return "SOS";
    };

    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName={getInitialRoute()}
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!user ? (
                    <>
                        <Stack.Screen 
                            name="Landing" 
                            component={LandingScreen}
                            options={{ title: 'Landing Screen' }}
                        />
                        <Stack.Screen 
                            name="SignIn" 
                            component={SignInScreen}
                            options={{ title: 'Sign In Screen' }}
                        />
                        <Stack.Screen 
                            name="SignUp" 
                            component={SignUpScreen}
                            options={{ title: 'Sign Up Screen' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                            name="CompleteProfile" 
                            component={CompleteProfileScreen}
                            options={{ title: 'Complete Profile Screen' }}
                        />
                        <Stack.Screen 
                            name="SOS" 
                            component={SOSScreen}
                            options={{ title: 'SOS Screen' }}
                        />
                        <Stack.Screen 
                            name="Profile" 
                            component={ProfileScreen}
                            options={{ title: 'Profile Screen' }}
                        />
                        <Stack.Screen 
                            name="ModifyProfile" 
                            component={ModifyProfileScreen}
                            options={{ title: 'Modify Profile Screen' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
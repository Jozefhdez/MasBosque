import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Landing: undefined;
    SignIn: undefined;
    SignUp: undefined;
    CompleteProfile: undefined;
    SOS: undefined;
    Profile: undefined;
    ModifyProfile: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

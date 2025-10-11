import { Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Iniciar sesion</Text>
      <Button title="SOS" onPress={() => router.push("./sos")} />
    </View>
  );
}

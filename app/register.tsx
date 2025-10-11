import { Text, View, Button } from "react-native";
import { router } from "expo-router";


export default function Register() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Registrar</Text>
      <Button title="Completar perfil" onPress={() => router.push("./completeProfile")} />
    </View>
  );
}

import { Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function CompleteProfile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Completar perfil</Text>
      <Button title="SOS" onPress={() => router.push("./sos")} />
    </View>
  );
}

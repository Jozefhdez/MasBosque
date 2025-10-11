import { Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function Sos() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>SOS</Text>
      <Button title="Perfil" onPress={() => router.push("./profile")} />
    </View>
  );
}

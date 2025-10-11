import { Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Perfil</Text>
      <Button title="Modificar información" onPress={() => router.push("./modifyProfile")} />
    </View>
  );
}

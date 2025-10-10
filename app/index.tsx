import {StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.mainContainer}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>BALTA ESTUVO AQUI 3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})

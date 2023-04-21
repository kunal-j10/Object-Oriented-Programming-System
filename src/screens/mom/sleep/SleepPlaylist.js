import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SleepPlaylist() {
  return (
    <View style={styles.container}>
      <Text>SleepPlaylist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

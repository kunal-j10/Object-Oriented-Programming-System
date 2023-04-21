import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default ErrorMessage = ({ message, style }) => (
  <View style={styles.errorWrapper}>
    <Text style={style}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  errorWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
});

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function OutlineBtn(props) {
  const {
    onPress,
    title,
    containerStyle,
    textStyle,
    color = Colors.primary,
    ...textProps
  } = props;

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: color }, containerStyle]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color }, textStyle]} {...textProps}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 38,
    paddingVertical: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

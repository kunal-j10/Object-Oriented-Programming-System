import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../constants/Colors";

export default function GradientBtn(props) {
  const {
    onPress,
    title,
    gradientStyle,
    textStyle,
    containertStyle,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    colors = Colors.gradient,
    ...textProps
  } = props;

  return (
    <TouchableOpacity
      style={[styles.container, containertStyle]}
      onPress={onPress}
    >
      <LinearGradient
        start={start}
        end={end}
        colors={colors}
        style={[styles.gradient, gradientStyle]}
      >
        <Text style={[styles.text, textStyle]} {...textProps}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 38,
    paddingVertical: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

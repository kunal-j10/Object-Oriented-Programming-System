import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { HEADER_HEIGHT } from "./dimensions";

export default Header = ({ percent }) => {
  const opacity = useDerivedValue(() => {
    return interpolate(percent.value, [0, 80, 100], [0, 0, 1]);
  });

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <Ionicons name="chevron-back" size={24} color="black" />
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Playing Now</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});

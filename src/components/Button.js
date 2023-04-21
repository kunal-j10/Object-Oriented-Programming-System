import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Button = ({ style, onPress, title }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.Button}
        colors={["#19C190", "#F5B700"]}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Button: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 38,
    paddingVertical: 8,
    borderRadius: 24,
  },
});

export default Button;

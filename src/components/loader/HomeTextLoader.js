import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
const DEVICE_HEIGHT = Dimensions.get("window").height;
export default function HomeTextLoader({ style }) {
  return (
    <View>
      <LottieView
        source={require("../../../assets/lottie/skelleton.json")}
        style={[styles.animation, style]}
        autoPlay
      />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: "100%",
  },
});

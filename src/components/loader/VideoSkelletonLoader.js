import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
const DEVICE_HEIGHT = Dimensions.get("window").height;
const DEVICE_WIDTH = Dimensions.get("window").width;

export default function VideoSkelletonLoader() {
  return (
    <View style={styles.animation}>
      <LottieView
        source={require("../../../assets/lottie/Videocard.json")}
        autoPlay
      />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: "100%",
    height: DEVICE_HEIGHT * 0.4,
  },
});

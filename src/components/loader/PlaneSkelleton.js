import React from "react";
import { StyleSheet, View, Text,Dimensions } from "react-native";
import LottieView from "lottie-react-native";
const DEVICE_HEIGHT = Dimensions.get("window").height;
export default function PlaneSkelleton() {
  return (
    
      <LottieView
        source={require("../../../assets/lottie/planeSkelleton.json")}
        style={styles.animation}
        autoPlay
      />

  );
}
const styles = StyleSheet.create({
  animation: {
   width: "100%",
    height: "100%",
  
  },
});



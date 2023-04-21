import React from "react";
import { StyleSheet, View, Text,Dimensions } from "react-native";
import LottieView from "lottie-react-native";
const DEVICE_HEIGHT = Dimensions.get("window").height;
export default function ProfileSkelletonLoader() {
  return (
    <View>
      <LottieView
        source={require("../../../assets/lottie/Profile.json")}
        style={styles.animation}
        autoPlay
      />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
   width: "100%",
    height: DEVICE_HEIGHT*0.23,
  
  },
});



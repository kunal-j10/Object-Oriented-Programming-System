import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import loaderjson from "../../../assets/lottie/splashLoader.json"

export default function LoaderPost(props) {
  return (
    <View>
      <LottieView source={loaderjson} style={[styles.animation,props.style]} autoPlay />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: 20,
    height: 20,
  },
});

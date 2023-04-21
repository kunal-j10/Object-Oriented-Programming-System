import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import loaderJson from "../../../assets/lottie/loaderPost.json";

export default function LoaderPost(props) {
  return (
    <View>
      <LottieView source={loaderJson} style={[styles.animation,props.style]} autoPlay />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
});

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  withTiming,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import {
  sleepElapsedMill,
  sleepTotalMill,
} from "../../../../store/sleep/selector";

import { WIDTH } from "./dimensions";

export default Position = ({ percent }) => {
  const elapsedMill = useSelector(sleepElapsedMill);
  const totalMill = useSelector(sleepTotalMill);

  const position = useSharedValue(90);

  useEffect(() => {
    position.value = elapsedMill;
  }, [elapsedMill]);

  const width = useDerivedValue(() => {
    return interpolate(position.value, [0, totalMill], [0, WIDTH]);
  });

  const opacity = useDerivedValue(() => {
    return interpolate(percent.value, [0, 80], [1, 0]);
  });

  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.container, style]} />;
};

const styles = StyleSheet.create({
  container: {
    top: -3,
    left: 0,
    height: 3,
    position: "absolute",
    backgroundColor: "#03B44D",
  },
});

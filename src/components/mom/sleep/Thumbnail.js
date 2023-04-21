import React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { sleepSelectedSong } from "../../../../store/sleep/selector";
import {
  WIDTH,
  MINI_HEIGHT,
  THUMBNAIL_WIDTH,
  THUMBNAIL_HEIGHT,
} from "./dimensions";

export default Thumbnail = ({ percent, offsetY }) => {
  const selectedSong = useSelector(sleepSelectedSong);

  const translateY = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [offsetY.value * -1, 0]);
  });

  const containerWidth = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [MINI_HEIGHT + 10, WIDTH]);
  });

  const thumbnailWidth = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [MINI_HEIGHT - 16, THUMBNAIL_WIDTH]
    );
  });

  const thumbnailHeight = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [MINI_HEIGHT - 24, THUMBNAIL_HEIGHT]
    );
  });

  const paddingVertical = useDerivedValue(() => {
    return interpolate(percent.value, [0, 50, 100], [12, 12, 0]);
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: containerWidth.value,
      height: thumbnailHeight.value,
      paddingVertical: paddingVertical.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const borderRadius = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [10, 20]);
  });

  const elevation = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [0, 4]);
  });

  const shadowColor = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [100, 80]);
  });

  const shadowOpacity = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [0, 0.15]);
  });

  const shadowRadius = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [0, 15]);
  });

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      width: thumbnailWidth.value,
      height: thumbnailHeight.value,
      borderRadius: borderRadius.value,
      elevation: elevation.value,
      shadowColor: `hsl(143, 54%, ${shadowColor.value}%)`,
      shadowOpacity: shadowOpacity.value,
      shadowRadius: shadowRadius.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.wrapper, wrapperStyle]}>
        <Image
          source={{ uri: selectedSong.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    position: "absolute",
    alignItems: "center",
  },
  wrapper: {
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});

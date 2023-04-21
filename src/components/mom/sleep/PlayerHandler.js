import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import {
  WIDTH,
  MINI_CONTROL_WIDTH,
  SNAP_BOTTOM,
  SNAP_TOP,
  HEADER_HEIGHT,
  BOTTOM_INSET,
} from "./dimensions";
import {
  sleepPrevSongId,
  sleepSelectedSong,
} from "../../../../store/sleep/selector";

export default PlayerHandler = ({ percent, translateY, gestureHandler }) => {
  const selectedSong = useSelector(sleepSelectedSong);
  const prevSongId = useSelector(sleepPrevSongId);

  useEffect(() => {
    if (selectedSong && selectedSong._id !== prevSongId) {
      translateY.value = withSpring(SNAP_TOP, {
        stiffness: 40,
        overshootClamping: true,
      });
    }
  }, [selectedSong, prevSongId]);

  const width = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [WIDTH - MINI_CONTROL_WIDTH, WIDTH]
    );
  });

  const styleContainer = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const styleWrapper = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const handlePlayer = () => {
    if (percent.value === 0) {
      translateY.value = withSpring(SNAP_TOP, {
        stiffness: 40,
        overshootClamping: true,
      });
    } else if (percent.value === 100) {
      translateY.value = withSpring(SNAP_BOTTOM, {
        stiffness: 40,
        overshootClamping: true,
      });
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, styleContainer]}>
        <TouchableOpacity
          onPress={handlePlayer}
          style={[styles.playerWrapper, styleWrapper]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: HEADER_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 99,
    // backgroundColor: "transparent",
  },
  playerWrapper: {
    height: "100%",
  },
});

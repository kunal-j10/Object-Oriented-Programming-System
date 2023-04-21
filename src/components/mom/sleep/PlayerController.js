import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect } from "react";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../../constants/Colors";
import {
  BOTTOM_INSET,
  HEADER_HEIGHT,
  MINI_CONTROL_WIDTH,
  SECTION_HEIGHT,
  WIDTH,
} from "./dimensions";
import {
  sleepIsBuff,
  sleepIsPlaying,
  sleepLoop,
  sleepLoopWarn,
  sleepSelectedSong,
} from "../../../../store/sleep/selector";
import {
  playNext,
  playPrev,
  sleepPlayToggle,
  sleepRemoveLoopWarn,
  sleepToggleLike,
  updateLoop,
} from "../../../../store/sleep/slice";
import Toast from "react-native-root-toast";
import { LinearGradient } from "expo-linear-gradient";

export default function PlayerController(props) {
  const { percent, song } = props;

  const isPlaying = useSelector(sleepIsPlaying);
  const isBuff = useSelector(sleepIsBuff);
  const loop = useSelector(sleepLoop);
  const loopWarn = useSelector(sleepLoopWarn);
  const selectedSong = useSelector(sleepSelectedSong);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  // displaying errors if occured
  useEffect(() => {
    if (loopWarn !== "") {
      Toast.show(loopWarn, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(sleepRemoveLoopWarn());
        },
      });
    }
  }, [loopWarn]);

  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const handleLayout = useCallback(({ nativeEvent: { layout } }) => {
    offsetY.value = layout.y;
  }, []);

  const handleMainLayout = useCallback(({ nativeEvent: { layout } }) => {
    offsetX.value = layout.x;
  }, []);

  const translateY = useDerivedValue(() =>
    interpolate(percent.value, [0, 100], [offsetY.value * -1 + 12, 0])
  );

  const translateX = useDerivedValue(() =>
    interpolate(
      percent.value,
      [0, 100],
      [WIDTH - MINI_CONTROL_WIDTH - offsetX.value, 0]
    )
  );

  const opacityDerived = useDerivedValue(() =>
    interpolate(percent.value, [80, 100], [0, 1])
  );

  const scale = useDerivedValue(() =>
    interpolate(percent.value, [0, 100], [1, 1.5])
  );

  const controllerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const favStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const repeatStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const recordStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const playSong = useCallback(() => {
    song.playAsync();
    dispatch(sleepPlayToggle({ isPlaying: true }));
  }, [song]);

  const pauseSong = useCallback(() => {
    song.pauseAsync();
    dispatch(sleepPlayToggle({ isPlaying: false }));
  }, [song]);

  const handleLoop = useCallback(() => {
    song.setIsLoopingAsync(loop === 1);

    dispatch(updateLoop());
  }, [loop, song]);

  const handlePrev = useCallback(() => {
    dispatch(playPrev());
  }, []);

  const handleNext = useCallback(() => {
    dispatch(playNext());
  }, []);

  const handleViewLyric = () => {
    navigation.navigate("SleepRecorder");
  };

  const handleLike = () => {
    dispatch(sleepToggleLike({ lullabyId: selectedSong._id }));
  };

  return (
    <View onLayout={handleLayout} style={styles.container}>
      <View style={styles.controller}>
        <Animated.View style={favStyle}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLike}>
            <Ionicons
              name={selectedSong.isLiked ? "heart" : "heart-outline"}
              size={24}
              color={Colors.appPrimaryColor}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          onLayout={handleMainLayout}
          style={[controllerStyle, styles.mainController]}
        >
          <TouchableOpacity style={styles.iconBtn} onPress={handlePrev}>
            <MaterialIcons
              name="skip-previous"
              size={28}
              color={Colors.appPrimaryColor}
            />
          </TouchableOpacity>

          {isBuff ? (
            <View style={styles.buffering}>
              <ActivityIndicator size="large" color={Colors.appPrimaryColor} />
            </View>
          ) : isPlaying ? (
            <TouchableOpacity style={styles.iconBtn} onPress={pauseSong}>
              <AntDesign
                name="pausecircle"
                size={40}
                color={Colors.appPrimaryColor}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconBtn} onPress={playSong}>
              <AntDesign name="play" size={40} color={Colors.appPrimaryColor} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={handleNext}>
            <MaterialIcons
              name="skip-next"
              size={28}
              color={Colors.appPrimaryColor}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={repeatStyle}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLoop}>
            <MaterialCommunityIcons
              name={
                loop === 0
                  ? "repeat-off"
                  : loop === 1
                  ? "repeat"
                  : "repeat-once"
              }
              size={28}
              color={Colors.appPrimaryColor}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View style={[recordStyle, styles.bottom]}>
        <TouchableOpacity onPress={handleViewLyric}>
          <View style={styles.viewLyrics}>
            <Text style={styles.viewLyricsTxt}>View Lyrics</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: SECTION_HEIGHT + HEADER_HEIGHT + 42,
    left: 0,
    bottom: BOTTOM_INSET,
  },
  controller: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: WIDTH,
  },
  iconBtn: {
    padding: 5,
  },
  mainController: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 50,
  },
  recordTxt: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buffering: {
    justifyContent: "center",
    marginRight: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
  viewLyrics: {
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    padding: 30,
    alignItems: "center",
    backgroundColor: Colors.appPrimaryColor,
  },
  viewLyricsTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

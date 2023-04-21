import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  MINI_CONTROL_WIDTH,
  MINI_HEIGHT,
  SECTION_HEIGHT,
  SNAP_BOTTOM,
  THUMBNAIL_HEIGHT,
  WIDTH,
} from "./dimensions";
import Thumbnail from "./Thumbnail";
import Colors from "../../../../constants/Colors";
import { useSelector } from "react-redux";
import {
  sleepElapsedMill,
  sleepElapsedString,
  sleepSelectedSong,
  sleepTotalMill,
  sleepTotalString,
} from "../../../../store/sleep/selector";
import { useDispatch } from "react-redux";
import { sleepAddTimer, sleepUpdateTime } from "../../../../store/sleep/slice";
import TimerModal from "./TimerModal";

const offsetContentX = MINI_HEIGHT + 14;
const MINI_CONTENT_WIDTH = WIDTH - (offsetContentX + MINI_CONTROL_WIDTH);

export default PlayerContainer = (props) => {
  const { percent, song, translateY: translateYMain } = props;

  const [timerModal, setTimerModal] = useState(false);
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const [sec, setSec] = useState("");
  const [inputErr, setInputErr] = useState("");

  const selectedSong = useSelector(sleepSelectedSong);
  const elapsedString = useSelector(sleepElapsedString);
  const elapsedMill = useSelector(sleepElapsedMill);
  const totalMill = useSelector(sleepTotalMill);
  const totalString = useSelector(sleepTotalString);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const offsetContainerY = useSharedValue(0);
  const offsetContentY = useSharedValue(0);

  const onContainerLayout = useCallback(({ nativeEvent: { layout } }) => {
    offsetContainerY.value = layout.y;
  }, []);

  const onContentLayout = useCallback(({ nativeEvent: { layout } }) => {
    offsetContentY.value = layout.y;
  }, []);

  const translateY = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [(offsetContentY.value + offsetContainerY.value) * -1, 0]
    );
  });

  const translateX = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [offsetContentX, 24]);
  });

  const width = useDerivedValue(() => {
    return interpolate(
      percent.value,
      [0, 100],
      [MINI_CONTENT_WIDTH, WIDTH - 48]
    );
  });

  const height = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [MINI_HEIGHT, 81]);
  });

  const paddingRight = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [5, 0]);
  });

  const marginTop = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [14, 0]);
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      paddingRight: paddingRight.value,
      marginTop: marginTop.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    };
  });

  const songFontSize = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [16, 22]);
  });

  const songStyle = useAnimatedStyle(() => {
    return {
      fontSize: songFontSize.value,
      fontWeight: percent.value === 0 ? "400" : "bold",
    };
  });

  const artistFontSize = useDerivedValue(() => {
    return interpolate(percent.value, [0, 100], [14, 16]);
  });

  const langStyle = useAnimatedStyle(() => {
    return {
      fontSize: artistFontSize.value,
    };
  });

  const opacityDerived = useDerivedValue(() =>
    interpolate(percent.value, [80, 100], [0, 1])
  );

  const playlistStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const playlistTimerStyle = useAnimatedStyle(() => ({
    opacity: opacityDerived.value,
  }));

  const handleSlidingStart = useCallback(() => {
    song.pauseAsync();
  }, [song]);

  const handleValueChange = useCallback((mill) => {
    dispatch(sleepUpdateTime(mill));
  }, []);

  const handleSlidingComplete = useCallback(
    (mill) => {
      song.setPositionAsync(mill);
      song.playAsync();
      dispatch(sleepUpdateTime(mill));
    },
    [song]
  );

  const handleQueue = () => {
    navigation.navigate("Queue");
    translateYMain.value = withSpring(SNAP_BOTTOM, {
      stiffness: 40,
      overshootClamping: true,
    });
  };

  const handleTimerModal = () => {
    setTimerModal(true);
  };

  const handleModalClose = () => {
    setTimerModal(false);
    setHour("");
    setMin("");
    setSec("");
    setInputErr("");
  };

  const handleAddTimer = () => {
    const h = hour.trim();
    const m = min.trim();
    const s = sec.trim();

    if (h !== hour) setHour(h);
    if (m !== min) setMin(m);
    if (s !== sec) setSec(s);

    if (h === "" && m === "" && s === "") setInputErr("Invalid time");
    else if (h.match(/\D/) || m.match(/\D/) || s.match(/\D/))
      setInputErr("Invalid time");
    else if (h > 2) setInputErr("More than 2 hours are not allowed");
    else if (h < 0)
      setInputErr("Invalid hour field, negative value is not allowed");
    else if (m > 59)
      setInputErr(
        "Invalid minute field, less than 60 minutes are only allowed"
      );
    else if (m < 0)
      setInputErr("Invalid minute field, negative value is not allowed");
    else if (s > 59)
      setInputErr(
        "Invalid second field, less than 60 seconds are only allowed"
      );
    else if (h < 0 && m < 0 && s <= 0)
      setInputErr(
        "Invalid second field, negative or zero value is not allowed"
      );
    else {
      dispatch(sleepAddTimer({ h, m, s }));
      handleModalClose();
    }
  };

  return (
    <View onLayout={onContainerLayout} style={styles.container}>
      <Thumbnail percent={percent} offsetY={offsetContainerY} />
      <View onLayout={onContentLayout} style={styles.content}>
        <Animated.View style={contentStyle}>
          <View style={styles.contentRow}>
            <View>
              <Animated.Text style={[songStyle, styles.capitalize]}>
                {selectedSong.title}
              </Animated.Text>
              <Animated.Text
                style={[langStyle, styles.capitalize, { marginTop: 5 }]}
              >
                {selectedSong.language}
              </Animated.Text>
            </View>
            <Animated.View style={[playlistTimerStyle, styles.contentRow]}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleQueue}>
                <MaterialIcons
                  name="playlist-play"
                  size={24}
                  color={Colors.appPrimaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleTimerModal}
              >
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={Colors.appPrimaryColor}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Animated.View
            style={[playlistStyle, styles.contentRow, { marginTop: 15 }]}
          >
            <Text style={styles.playlist}></Text>
            <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
              <Ionicons
                name="share-social-outline"
                size={24}
                color={Colors.appPrimaryColor}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View style={sliderStyle}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={totalMill}
            step={1000}
            value={elapsedMill}
            minimumTrackTintColor={Colors.appPrimaryColor}
            thumbTintColor={Colors.appPrimaryColor}
            maximumTrackTintColor="#000000"
            tapToSeek={true}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            onValueChange={handleValueChange}
          />
          <View style={[styles.contentRow, styles.sliderControl]}>
            <Text>{elapsedString}</Text>
            <Text>{totalString}</Text>
          </View>
        </Animated.View>
      </View>

      <TimerModal
        onClose={handleModalClose}
        onSubmit={handleAddTimer}
        isVisible={timerModal}
        hour={hour}
        min={min}
        sec={sec}
        inputErr={inputErr}
        setHour={setHour}
        setMin={setMin}
        setSec={setSec}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: SECTION_HEIGHT,
  },
  content: {
    position: "absolute",
    top: THUMBNAIL_HEIGHT + 24,
    left: 0,
    width: WIDTH,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "flex-end",
    alignItems: "center",
  },
  iconBtn: {
    padding: 5,
  },
  playlist: {
    color: Colors.appPrimaryColor,
  },
  slider: {
    marginHorizontal: 24,
    marginTop: 35,
  },
  sliderControl: {
    marginHorizontal: 24,
    marginTop: 5,
  },
  capitalize: {
    textTransform: "capitalize",
  },
});

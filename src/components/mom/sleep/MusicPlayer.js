import { Audio } from "expo-av";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, LogBox } from "react-native";
import Animated, {
  withSpring,
  interpolate,
  Extrapolate,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';

import {
  sleepPrevSongId,
  sleepSelectedSong,
  sleepTimer,
  sleepTotalMill,
} from "../../../../store/sleep/selector";
import {
  playNext,
  sleepPlayToggle,
  sleepRecommendFetch,
  sleepStoreHistory,
  sleepTotalDur,
  sleepUpdateTime,
} from "../../../../store/sleep/slice";

import {
  WIDTH,
  HEIGHT,
  TOP_INSET,
  SNAP_TOP,
  SNAP_BOTTOM,
  BOTTOM_INSET,
} from "./dimensions";
import Header from "./Header";
import PlayerContainer from "./PlayerContainer";
import PlayerController from "./PlayerController";
import PlayerHandler from "./PlayerHandler";
import Position from "./Position";

const defaultAudioConfig = {
  progressUpdateIntervalMillis: 1000,
  positionMillis: 0,
  shouldPlay: true,
  rate: 1.0,
  shouldCorrectPitch: false,
  volume: 1.0,
  isMuted: false,
  isLooping: false,
};

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

export default MusicPlayer = () => {
  const selectedSong = useSelector(sleepSelectedSong);
  const prevSongId = useSelector(sleepPrevSongId);
  const totalMill = useSelector(sleepTotalMill);
  const timer = useSelector(sleepTimer);

  const [song, setSong] = useState();

  const dispatch = useDispatch();

  const navigation = useNavigation();

  useEffect(() => {
    let timeout;
    if (timer) {
      timeout = setTimeout(() => {
        if (song) song.pauseAsync();
      }, timer);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [timer, song]);

  useEffect(() => {
    if (selectedSong._id !== prevSongId)
      dispatch(sleepRecommendFetch(selectedSong));
  }, [selectedSong, prevSongId]);

  const onPlaybackStatusUpdate = useCallback(async (playbackStatus) => {
    try {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          throw new Error(
            `Encountered a fatal error during playback: ${playbackStatus.error}`
          );
        }
      } else if (playbackStatus?.isBuffering) {
        dispatch(sleepPlayToggle({ isBuff: true }));
      } else {
        dispatch(sleepPlayToggle({ isPlaying: playbackStatus.isPlaying }));

        dispatch(sleepUpdateTime(playbackStatus.positionMillis));

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          dispatch(playNext());
        }

        if (playbackStatus.didJustFinish) {
          dispatch(
            sleepStoreHistory({
              status: "completed",
            })
          );
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    let componentMounted = true;

    const initialiseSong = async () => {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: selectedSong.audioUrl },
        { ...defaultAudioConfig, shouldPlay: false },
        onPlaybackStatusUpdate
      );

      dispatch(sleepTotalDur(status.durationMillis));
      componentMounted && setSong(sound);
    };

    initialiseSong();

    return () => {
      componentMounted = false;
    };
  }, []);

  // pausing song if user leave the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      if (!song) return;

      dispatch(sleepUpdateTime(0));
      await song.unloadAsync();
    });

    return unsubscribe;
  }, [song, navigation]);

  useEffect(() => {
    const updateSong = async () => {
      try {
        let status = await song.getStatusAsync();

        await song.unloadAsync();
        await song.loadAsync(
          { uri: selectedSong.audioUrl },
          { ...defaultAudioConfig, isLooping: status.isLooping }
        );

        status = await song.getStatusAsync();
        dispatch(
          sleepStoreHistory({ lullabyId: selectedSong._id, status: "active" })
        );
        dispatch(sleepTotalDur(status.durationMillis));
      } catch (err) {
        alert(err.message);
      }
    };

    if (song && selectedSong._id !== prevSongId) {
      updateSong();
    }
  }, [song, selectedSong, prevSongId]);

  const translateY = useSharedValue(SNAP_BOTTOM);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const min = SNAP_BOTTOM;
      const max = SNAP_TOP;

      let value = ctx.startY + event.translationY;

      if (value > min) {
        value = min;
      } else if (value < max) {
        value = max;
      }

      translateY.value = value;
    },
    onEnd: (event) => {
      const velocity = event.velocityY;
      const toValue = velocity > 0 ? SNAP_BOTTOM : 0;

      translateY.value = withSpring(toValue, {
        velocity,
        stiffness: 40,
        overshootClamping: true,
      });
    },
  });

  const percent = useDerivedValue(() =>
    interpolate(
      translateY.value,
      [SNAP_BOTTOM, SNAP_TOP],
      [0, 100],
      Extrapolate.CLAMP
    )
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, style]}>
      <PlayerHandler
        percent={percent}
        translateY={translateY}
        gestureHandler={gestureHandler}
      />
      {totalMill > 0 && <Position percent={percent} />}
      <Header percent={percent} />
      <PlayerContainer percent={percent} song={song} translateY={translateY} />
      <PlayerController percent={percent} song={song} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: TOP_INSET,
    left: 0,
    bottom: 0,
    // marginTop: TOP_INSET,
    marginBottom: BOTTOM_INSET,
    width: WIDTH,
    height: HEIGHT,
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
  },
});

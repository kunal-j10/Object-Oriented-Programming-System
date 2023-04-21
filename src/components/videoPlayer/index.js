import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Audio, Video } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";

import videoPlayerDefaultProps from "./videoPlayerDefaultProps";
import { getTimeFromMilliSec, deepMerge } from "../../utils/helper";
import ErrorMessage from "../ErrorMessage";
import TouchableButton from "../TouchableButton";

const VideoPlayer = (tempProps) => {
  const props = deepMerge(videoPlayerDefaultProps, tempProps);

  let playbackInstance = null;
  let controlsTimer = null;
  let initialShow = props.defaultControlsVisible;

  const screenRatio = props.style.width / props.style.height;
  let videoHeight = props.style.height;
  let videoWidth = videoHeight * screenRatio;
  if (videoWidth > props.style.width) {
    videoWidth = props.style.width;
    videoHeight = videoWidth / screenRatio;
  }

  const controlsOpacity = useRef(
    new Animated.Value(props.defaultControlsVisible ? 1 : 0)
  ).current;
  const { ref: sliderRef, ...sliderProps } = props.slider;

  const [errorMessage, setErrorMessage] = useState("");
  const [controlsState, setControlsState] = useState(
    props.defaultControlsVisible ? "Visible" : "Hidden"
  );
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: props.videoProps.source ? "Loading" : "Error",
  });

  useEffect(() => {
    setAudio();

    return async () => {
      if (playbackInstance) {
        await playbackInstance.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!props.videoProps.source) {
      console.error(
        "[VideoPlayer] `Source` is a required in `videoProps`. " +
          "Check https://docs.expo.io/versions/latest/sdk/video/#usage"
      );
      setErrorMessage("`Source` is a required in `videoProps`");
      setPlaybackInstanceInfo({ ...playbackInstanceInfo, state: "Error" });
    } else {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: props.videoProps.shouldPlay ? "Playing" : "Paused",
      });
    }
  }, [props.videoProps.source, props.videoProps.shouldPlay]);

  const getMinutesSecondsFromMilliseconds = useCallback((millis) => {
    const { second, minute } = getTimeFromMilliSec(millis);
    return `${minute}:${second}`;
  }, []);

  const hideAnimation = useCallback(() => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: props.animation.fadeOutDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setControlsState("Hidden");
      }
    });
  }, [controlsOpacity]);

  const animationToggle = () => {
    if (controlsState === "Hidden") {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: props.animation.fadeInDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setControlsState("Visible");
        }
      });
    } else if (controlsState === "Visible") {
      hideAnimation();
    }
    if (controlsTimer === null) {
      controlsTimer = setTimeout(() => {
        if (
          playbackInstanceInfo.state === "Playing" &&
          controlsState === "Hidden"
        ) {
          hideAnimation();
        }
        if (controlsTimer) {
          clearTimeout(controlsTimer);
        }
        controlsTimer = null;
      }, 2000);
    }
  };

  const setAudio = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      props.errorCallback({
        type: "NonFatal",
        message: "Audio.setAudioModeAsync",
        obj: e,
      });
    }
  }, []);

  const updatePlaybackCallback = (status) => {
    props.playbackCallback(status);
    if (status.isLoaded) {
      setPlaybackInstanceInfo((prevPlaybackInstanceInfo) => ({
        ...prevPlaybackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? "Ended"
          : status.isBuffering
          ? "Buffering"
          : status.shouldPlay
          ? "Playing"
          : "Paused",
      }));
      if (
        (status.didJustFinish && controlsState === "Hidden") ||
        (status.isBuffering && controlsState === "Hidden" && initialShow)
      ) {
        animationToggle();
        initialShow = false;
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setErrorMessage(errorMsg);
        props.errorCallback({
          type: "Fatal",
          message: errorMsg,
          obj: {},
        });
      }
    }
  };

  const togglePlay = async () => {
    if (controlsState === "Hidden") {
      return;
    }

    const shouldPlay = playbackInstanceInfo.state !== "Playing";
    if (playbackInstance !== null) {
      await playbackInstance.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === "Ended" && { positionMillis: 0 }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: playbackInstanceInfo.state === "Playing" ? "Paused" : "Playing",
      });
      if (shouldPlay) {
        animationToggle();
      }
    }

    if (playbackInstanceInfo.state !== "Playing" && props.isAudioPlaying) {
      await props.pauseRecording();
    }
  };

  if (playbackInstanceInfo.state === "Error") {
    return (
      <View
        style={{
          backgroundColor: props.style.videoBackgroundColor,
          width: videoWidth,
          height: videoHeight,
        }}
      >
        <ErrorMessage style={props.textStyle} message={errorMessage} />
      </View>
    );
  }

  if (playbackInstanceInfo.state === "Loading") {
    return (
      <View
        style={{
          backgroundColor: props.style.controlsBackgroundColor,
          width: videoWidth,
          height: videoHeight,
          justifyContent: "center",
        }}
      >
        {props.icon.loading || (
          <ActivityIndicator {...props.activityIndicator} />
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: props.style.videoBackgroundColor,
        width: videoWidth,
        height: videoHeight,
        maxWidth: "100%",
      }}
    >
      <Video
        style={styles.videoWrapper}
        {...props.videoProps}
        ref={(component) => {
          playbackInstance = component;
          if (props.videoProps.ref) {
            props.videoProps.ref.current = component;
          }
        }}
        onPlaybackStatusUpdate={updatePlaybackCallback}
      />

      <TouchableWithoutFeedback onPress={animationToggle}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: controlsOpacity,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: props.style.controlsBackgroundColor,
              opacity: 0.5,
            }}
          />
          <View pointerEvents={controlsState === "Visible" ? "auto" : "none"}>
            <View style={styles.iconWrapper}>
              <TouchableButton onPress={togglePlay}>
                <View>
                  {playbackInstanceInfo.state === "Buffering" &&
                    (props.icon.loading || (
                      <ActivityIndicator {...props.activityIndicator} />
                    ))}
                  {playbackInstanceInfo.state === "Playing" && props.icon.pause}
                  {playbackInstanceInfo.state === "Paused" && props.icon.play}
                  {playbackInstanceInfo.state === "Ended" && props.icon.replay}
                  {((playbackInstanceInfo.state === "Playing" &&
                    !props.icon.pause) ||
                    (playbackInstanceInfo.state === "Paused" &&
                      !props.icon.pause) ||
                    (playbackInstanceInfo.state === "Ended" &&
                      !props.icon.replay)) && (
                    <MaterialIcons
                      name={
                        playbackInstanceInfo.state === "Playing"
                          ? "pause"
                          : playbackInstanceInfo.state === "Paused"
                          ? "play-arrow"
                          : "replay"
                      }
                      style={props.icon.style}
                      size={props.icon.size}
                      color={props.icon.color}
                    />
                  )}
                </View>
              </TouchableButton>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.bottomInfoWrapper, { opacity: controlsOpacity }]}
      >
        {props.timeVisible && (
          <Text style={[props.textStyle, styles.timeLeft]}>
            {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)}
          </Text>
        )}
        {props.slider.visible && (
          <Slider
            {...sliderProps}
            style={[styles.slider, props.slider.style]}
            value={
              playbackInstanceInfo.duration
                ? playbackInstanceInfo.position / playbackInstanceInfo.duration
                : 0
            }
            onSlidingStart={() => {
              if (playbackInstanceInfo.state === "Playing") {
                togglePlay();
                setPlaybackInstanceInfo({
                  ...playbackInstanceInfo,
                  state: "Paused",
                });
              }
            }}
            onSlidingComplete={async (e) => {
              const position = e * playbackInstanceInfo.duration;
              if (playbackInstance) {
                await playbackInstance.setStatusAsync({
                  positionMillis: position,
                  shouldPlay: true,
                });
              }
              setPlaybackInstanceInfo({ ...playbackInstanceInfo, position });
            }}
          />
        )}
        {props.timeVisible && (
          <Text style={[props.textStyle, styles.timeRight]}>
            {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
          </Text>
        )}
        {props.fullscreen.visible && (
          <TouchableButton
            onPress={() =>
              props.fullscreen.inFullscreen
                ? props.fullscreen.exitFullscreen()
                : props.fullscreen.enterFullscreen()
            }
          >
            <View>
              {props.icon.fullscreen}
              {props.icon.exitFullscreen}
              {((!props.icon.fullscreen && props.fullscreen.inFullscreen) ||
                (!props.icon.exitFullscreen &&
                  !props.fullscreen.inFullscreen)) && (
                <MaterialIcons
                  name={
                    props.fullscreen.inFullscreen
                      ? "fullscreen-exit"
                      : "fullscreen"
                  }
                  style={props.icon.style}
                  size={props.icon.size / 2}
                  color={props.icon.color}
                />
              )}
            </View>
          </TouchableButton>
        )}
      </Animated.View>
    </View>
  );
};

const comparingProps = (prevProps, nextProps) => {
  return (
    prevProps.videoProps.shouldPlay === nextProps.videoProps.shouldPlay &&
    prevProps.videoProps.source.uri === nextProps.videoProps.source.uri &&
    prevProps.fullscreen.inFullscreen === nextProps.fullscreen.inFullscreen &&
    prevProps.isAudioPlaying === nextProps.isAudioPlaying &&
    prevProps.style.height === nextProps.style.height &&
    prevProps.style.width === nextProps.style.width &&
    prevProps.pauseRecording === nextProps.pauseRecording &&
    prevProps.fullscreen.enterFullscreen ===
      nextProps.fullscreen.enterFullscreen &&
    prevProps.fullscreen.exitFullscreen === nextProps.fullscreen.exitFullscreen
  );
};

export default React.memo(VideoPlayer, comparingProps);

const styles = StyleSheet.create({
  videoWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  iconWrapper: {
    borderRadius: 100,
    overflow: "hidden",
    padding: 10,
  },
  bottomInfoWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    bottom: 0,
    left: 0,
    right: 0,
  },
  timeLeft: {
    backgroundColor: "transparent",
    marginLeft: 5,
  },
  timeRight: {
    backgroundColor: "transparent",
    marginRight: 5,
  },
  slider: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

import { Dimensions, Platform } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";

export default videoPlayerDefaultProps = {
  errorCallback: (error) => {
    crashlytics().recordError(error);
    console.error(
      `[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`
    );
  },
  playbackCallback: () => {},
  defaultControlsVisible: false,
  timeVisible: true,
  slider: {
    visible: true,
  },
  textStyle: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
  activityIndicator: {
    size: "large",
    color: "#999",
  },
  animation: {
    fadeInDuration: 300,
    fadeOutDuration: 300,
  },
  style: {
    width: Platform.OS === "web" ? "100%" : Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    videoBackgroundColor: "#000",
    controlsBackgroundColor: "#000",
  },
  icon: {
    size: 48,
    color: "#FFF",
    style: {
      padding: 2,
    },
  },
  fullscreen: {
    enterFullscreen: () => {
      crashlytics().log(
        "[VideoPlayer] - missing `enterFullscreen` function in `fullscreen` prop"
      );
      console.log(
        "[VideoPlayer] - missing `enterFullscreen` function in `fullscreen` prop"
      );
    },
    exitFullscreen: () => {
      crashlytics().log(
        "[VideoPlayer] - missing `exitFullscreen` function in `fullscreen` prop"
      );
      console.log(
        "[VideoPlayer] - missing `exitFullscreen` function in `fullscreen` prop"
      );
    },
    inFullscreen: false,
    visible: true,
  },
};

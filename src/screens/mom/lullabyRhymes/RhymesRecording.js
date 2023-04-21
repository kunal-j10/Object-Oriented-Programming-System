import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Button,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";

import CustomHeaderButton from "../../../components/CustomHeaderButton";
import { getTimeFromMilliSec } from "../../../utils/helper";
import Colors from "../../../../constants/Colors";
import {
  updateCustomAudio,
  removeErrorToast,
} from "../../../../store/rhymes/operation";
import {
  rhymesErrorToastSelector,
  rhymesIsAudioUploadedSelector,
  rhymesIsAudioUploadingSelector,
} from "../../../../store/rhymes/selector";
import { useKeepAwake } from "expo-keep-awake";

const { height, width } = Dimensions.get("window");

let recording = new Audio.Recording();

const LyricsText = ({ lyrics }) => (
  <Text style={styles.lyricsText}>{lyrics}</Text>
);

export default function RhymesRecording({ navigation, route }) {
  const [isPermGrant, setIsPermGrant] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingPause, setIsRecordingPause] = useState(false);
  const [seconds, setSeconds] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("00");
  const [uri, setUri] = useState();
  const [duration, setDuration] = useState();

  const { lullabyId, lyrics, imageUrl } = route.params;
  const isAudioUploading = useSelector(rhymesIsAudioUploadingSelector);
  const isAudioUploaded = useSelector(rhymesIsAudioUploadedSelector);
  const errorToast = useSelector(rhymesErrorToastSelector);
  const dispatch = useDispatch();

  // to keep device awake till these screen is mounted
  useKeepAwake("rhymeRecordingScreen");

  // Requesting permissions..
  const getPermission = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsPermGrant(granted);
    } catch (error) {
      setIsPermGrant(false);
    }
  }, []);

  useEffect(() => {
    return async () => {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    if (errorToast !== "") {
      Toast.show(errorToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(removeErrorToast());
        },
      });
    }
  }, [errorToast]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(() => {
    if (isAudioUploaded === true) {
      navigation.replace("RhymesVideoDetail", { lullabyId });
    }
  }, [isAudioUploaded, lullabyId]);

  const backAction = () => {
    navigation.replace("RhymesVideoDetail", { lullabyId });

    return true;
  };

  const onRecordingStatusUpdate = useCallback(
    ({ isRecording, durationMillis, isDoneRecording }) => {
      if (isRecording && durationMillis > 1795000) {
        stopRecording();
      }
      if (isRecording || isDoneRecording) {
        const { second, minute, hour } = getTimeFromMilliSec(durationMillis);
        setSeconds(second);
        setMinutes(minute);
        setHours(hour);
      }
    },
    [stopRecording]
  );

  const startRecording = useCallback(async () => {
    setIsRecording(true);

    try {
      // Starting recording..
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      await recording.startAsync();
      // Recording started
    } catch (err) {
      try {
        recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
        await recording.startAsync();
      } catch (error) {
        setIsRecording(false);
        alert(`Failed to start recording ${error.message}`);
      }
    }
  }, [recording, onRecordingStatusUpdate]);

  const stopRecording = useCallback(async () => {
    try {
      // Stopping recording..
      const { durationMillis } = await recording.stopAndUnloadAsync();
      const URI = recording.getURI();
      setUri(URI);
      setDuration(durationMillis);
      // recording.
    } catch (error) {
      alert(`Failed to stop recording ${error.message}`);
    }
    setIsRecording(false);
  }, [recording]);

  const pauseRecording = useCallback(() => {
    try {
      recording.pauseAsync();
      setIsRecordingPause(true);
    } catch (error) {
      alert(`Failed to pause recording ${error.message}`);
    }
  }, [recording]);

  const resumeRecording = useCallback(() => {
    try {
      recording.startAsync();
      setIsRecordingPause(false);
    } catch (error) {
      alert(`Failed to resume recording ${error.message}`);
    }
  }, [recording]);

  const uploadRecording = useCallback(() => {
    dispatch(updateCustomAudio({ rhymeId: lullabyId, uri, duration }));
  }, [lullabyId, uri, duration]);

  if (!isPermGrant) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Audio permission not granted</Text>
        <Button onPress={getPermission} title="Give permission" />
      </View>
    );
  }

  if (isAudioUploading) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Stay on this screen till the recording is being uploaded
        </Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <View style={{ flex: 1 }}>
        <Image
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          source={{ uri: imageUrl }}
        />
        <View style={StyleSheet.absoluteFill}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.lyricsTextContainer}>
              <LyricsText lyrics={lyrics} />
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.recorderContainer}>
        <View
          style={[
            styles.recordingInfo,
            { marginTop: height * (isRecording ? 0.02 : 0.05) },
          ]}
        >
          {isRecording ? (
            <View style={styles.recordingInfoHeader}>
              <Entypo name="dot-single" size={32} color="black" />
              <Text>Rec</Text>
            </View>
          ) : null}
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {hours}:{minutes}:{seconds}
          </Text>
        </View>
        {isRecording ? (
          <View style={styles.recordingBtns}>
            {isRecordingPause ? (
              <TouchableOpacity style={styles.resume} onPress={resumeRecording}>
                <FontAwesome name="play" size={24} color="#03B44D" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pause} onPress={pauseRecording}>
                <AntDesign name="pause" size={24} color="#03B44D" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.stop} onPress={stopRecording}>
              <FontAwesome name="stop" size={32} color="red" />
            </TouchableOpacity>
            <View>
              <Text style={[styles.save, { color: "rgba(24, 20, 31, 0.4)" }]}>
                Save
              </Text>
            </View>
          </View>
        ) : uri ? (
          <View style={styles.recordingBtns}>
            <View style={styles.resume}>
              <FontAwesome name="play" size={24} color="#03B44D" />
            </View>
            <TouchableOpacity
              style={[styles.start, { marginTop: 0 }]}
              onPress={startRecording}
            >
              <View style={styles.circle}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadRecording}>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.start} onPress={startRecording}>
            <View style={styles.circle}></View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export const RhymesRecordingOptions = ({ navigation, route }) => {
  return {
    headerTitle: "Lullaby & Rhymes",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() =>
            navigation.replace("RhymesVideoDetail", {
              lullabyId: route.params.lullabyId,
            })
          }
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  permissionText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    marginHorizontal: 15,
    textAlign: "center",
  },
  recorderContainer: {
    height: height * 0.3,
  },
  recordingInfo: {
    alignSelf: "center",
  },
  recordingInfoHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: -8,
    marginBottom: -8,
  },
  recordingBtns: {
    marginTop: height * 0.07,
    marginHorizontal: width * 0.139,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  start: {
    marginTop: height * 0.07,
    alignSelf: "center",
    backgroundColor: "#D7FEE7",
    padding: 10,
    borderRadius: 50,
  },
  resume: {
    backgroundColor: "#D7FEE7",
    borderRadius: 50,
    paddingBottom: 10,
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 12,
  },
  pause: {
    backgroundColor: "#D7FEE7",
    borderRadius: 50,
    padding: 11,
  },
  stop: {
    padding: 20,
    paddingHorizontal: 23,
    backgroundColor: "#D7FEE7",
    borderRadius: 50,
  },
  save: {
    color: "rgba(24, 20, 31, 0.8)",
    fontSize: 24,
    fontWeight: "700",
  },
  circle: {
    backgroundColor: "red",
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  lyricsTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5, 4, 2, 0.6)",
  },
  lyricsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "85%",
    marginVertical: 5,
    lineHeight: 25,
  },
});

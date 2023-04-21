import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio, Video } from "expo-av";
import {
  MaterialCommunityIcons,
  Feather,
  AntDesign,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { setStatusBarHidden } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { useDimensions } from "@react-native-community/hooks";
import Toast from "react-native-root-toast";
import Spinner from "react-native-loading-spinner-overlay";
import Share from "react-native-share";
import { StatusBar } from "expo-status-bar";
import VideoCard from "../../../components/VideoCard";
import Colors from "../../../../constants/Colors";
import VideoPlayer from "../../../components/videoPlayer";
import { getTimeFromMilliSec } from "../../../utils/helper";
import {
  rhymesVideoDetailSelector,
  rhymesRecommendVideosSelector,
  rhymesIsVideoLoadingSelector,
  rhymesIsVideoRecomLoadingSelector,
  rhymesIsAudioUploadedSelector,
  rhymesErrorToastSelector,
  rhymesInFullScreenSelector,
} from "../../../../store/rhymes/selector";
import {
  fetchRhymeVideoDetail,
  removeRhymeVideoDetail,
  fetchRecommendRhymeVideos,
  toggleRhymeVideoLike,
  changeIsAudioUploaded,
  deleteCustomAudio,
  toggleFullScreen,
  removeErrorToast,
  rhymesUpdateWatchHistory,
} from "../../../../store/rhymes/operation";
import { removeNoInternetAction } from "../../../../store/auth/operation";
import { getDynamicLink } from "../../../utils/generateDynamicLink";
import { navigationRef } from "../../NavigationRefScreen";
import { useKeepAwake } from "expo-keep-awake";
import crashlytics from "@react-native-firebase/crashlytics";

export default function RhymesVideoDetail({ route, navigation }) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [recordingAdded, setRecordingAdded] = useState(false);
  const [totalAudioDuration, setTotalAudioDuration] = useState("00:00");
  const [currentAudioDuration, setCurrentAudioDuration] = useState("");
  const [isAudioBuff, setIsAudioBuff] = useState(false);
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const { lullabyId } = route.params;
  const [selectedId, setSelectedId] = useState(lullabyId);

  const { width, height } = useDimensions().window;

  // Geting data from store
  const videoDetail = useSelector(rhymesVideoDetailSelector);
  const recommendVideos = useSelector(rhymesRecommendVideosSelector);
  const isLoading = useSelector(rhymesIsVideoLoadingSelector);
  const isLoadingRecommend = useSelector(rhymesIsVideoRecomLoadingSelector);
  const isAudioUploaded = useSelector(rhymesIsAudioUploadedSelector);
  const inFullscreen = useSelector(rhymesInFullScreenSelector);
  const dispatch = useDispatch();

  // to keep device awake till these screen is mounted
  useKeepAwake("rhymeVideoDetailScreen");

  // Removing previous video detail
  useEffect(() => {
    return () => {
      dispatch(removeRhymeVideoDetail());
      dispatch(removeNoInternetAction(fetchRhymeVideoDetail.type));
      dispatch(removeNoInternetAction(fetchRecommendRhymeVideos.type));
    };
  }, [dispatch]);

  useEffect(() => {
    // Fetching video detail
    dispatch(fetchRhymeVideoDetail(selectedId));
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (isAudioUploaded === true) {
      dispatch(changeIsAudioUploaded());
    }
  }, [dispatch, lullabyId, isAudioUploaded]);

  useEffect(() => {
    if (videoDetail?.isCustomAudioAdded) {
      setRecordingAdded(true);
    } else {
      setRecordingAdded(false);
    }
  }, [videoDetail?.isCustomAudioAdded]);

  useEffect(() => {
    return sound
      ? async () => {
          await sound.unloadAsync();
        }
      : undefined;
  }, [sound, selectedId]);

  useEffect(() => {
    // Fetching recommended videos data
    if (!isLoading) {
      dispatch(fetchRecommendRhymeVideos({ rhymeId: videoDetail?._id }));
    }
  }, [dispatch, isLoading, videoDetail?._id]);

  const toggleLike = useCallback(() => {
    dispatch(toggleRhymeVideoLike(videoDetail?._id));
  }, [videoDetail?._id]);

  const onPlaybackStatusUpdate = useCallback(async (playbackStatus) => {
    try {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          throw new Error(
            `Encountered a fatal error during playback: ${playbackStatus.error}`
          );
        }
      } else if (playbackStatus?.isBuffering) {
        setIsAudioBuff(true);
      } else {
        setIsAudioBuff(false);
        const { second: totalSeconds, minute: totalMinutes } =
          getTimeFromMilliSec(playbackStatus.durationMillis);
        setTotalAudioDuration(`${totalMinutes}:${totalSeconds}`);

        const { second, minute } = getTimeFromMilliSec(
          playbackStatus.positionMillis
        );
        setCurrentAudioDuration(`${minute}:${second}`);

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          setIsAudioPlaying(false);
          setSound(undefined);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }, []);

  const playSound = async () => {
    try {
      let Sound = sound;
      if (!Sound) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: videoDetail?.customAudioUrl },
          {
            progressUpdateIntervalMillis: 500,
            positionMillis: 0,
            shouldPlay: false,
            rate: 1.0,
            shouldCorrectPitch: false,
            volume: 1.0,
            isMuted: false,
            isLooping: false,
          },
          onPlaybackStatusUpdate
        );
        Sound = sound;
        setSound(sound);
      }

      await Sound.playAsync();

      if (isVideoPlaying) {
        setIsVideoPlaying(false);
      }

      setIsAudioPlaying(true);
    } catch (error) {
      alert(`Failed to play recording ${error.message}`);
    }
  };

  const pauseRecording = useCallback(async () => {
    try {
      await sound.pauseAsync();
      setIsAudioPlaying(false);
    } catch (error) {
      alert(`Failed to pause recording ${error.message}`);
    }
  }, [sound]);

  const deleteRecording = useCallback(() => {
    dispatch(
      deleteCustomAudio({
        rhymeId: selectedId,
        audioUrl: videoDetail?.customAudioUrl,
      })
    );
  }, [selectedId, videoDetail?.customAudioUrl]);

  const alertDeleteAudio = useCallback(() => {
    Alert.alert(
      "Delete Audio",
      "Are you sure you want to delete the recording",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        { text: "OK", onPress: deleteRecording, style: "destructive" },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  }, [deleteRecording]);

  const enterFullscreen = useCallback(async () => {
    setStatusBarHidden(true, "fade");
    dispatch(toggleFullScreen());
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  }, []);

  const exitFullscreen = useCallback(async () => {
    setStatusBarHidden(false, "fade");
    dispatch(toggleFullScreen());
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }, []);

  // generating dynamiclink for sharing rhymes
  const generateShaerableLink = async () => {
    try {
      setIsLoadingForShareLink(true);
      let link = await getDynamicLink({ state: navigationRef.getRootState() });
      setIsLoadingForShareLink(false);

      const shareoptions = {
        url: link,
      };
      const ShareResponse = await Share.open(shareoptions);
    } catch (err) {
      crashlytics().recordError(err);
    }
  };

  const playbackCallback = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      dispatch(
        rhymesUpdateWatchHistory({
          rhymeId: videoDetail._id,
          status: "completed",
        })
      );
    }
  };

  const onReadyForDisplay = useCallback(() => {
    dispatch(
      rhymesUpdateWatchHistory({ rhymeId: videoDetail._id, status: "active" })
    );
  }, [videoDetail]);

  const EmptyRecommendedList = useMemo(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>No recommended video found!</Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const RenderItem = useCallback(
    ({ item }) => (
      <VideoCard
        videoImage={item.imageUrl}
        title={item.title}
        language={item.language}
        duration={item.duration}
        onPress={() => setSelectedId(item._id)}
      />
    ),
    []
  );

  const loadingFooter = useMemo(
    () =>
      isLoadingRecommend ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : null,
    [isLoadingRecommend]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* <LoaderPost /> */}
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <SafeAreaView>
        <VideoPlayer
          videoProps={{
            shouldPlay: isVideoPlaying,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
              uri: videoDetail?.videoUrl,
            },
            onReadyForDisplay,
          }}
          fullscreen={{
            inFullscreen: inFullscreen,
            enterFullscreen,
            exitFullscreen,
          }}
          isAudioPlaying={isAudioPlaying}
          pauseRecording={pauseRecording}
          style={{
            videoBackgroundColor: "black",
            height: inFullscreen ? height : height * 0.32,
            width,
          }}
          playbackCallback={playbackCallback}
        />
        <FlatList
          scrollEnabled={!inFullscreen}
          contentContainerStyle={{ flexGrow: 1 }}
          data={recommendVideos}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <>
              <View style={styles.content}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Text style={styles.name}>{videoDetail?.title}</Text>
                  {/* <TouchableOpacity onPress={() => {}}>
                    <MaterialIcons name="queue-music" size={24} color="black" />
                  </TouchableOpacity> */}
                </View>
                <Text style={styles.desc}>
                  Importance of Early Childhood Education and why it is worth
                  investing on.
                </Text>

                {/* Total Views, Like, and Share */}
                <View style={styles.actions}>
                  <View style={styles.action}>
                    <Feather name="eye" size={24} color="black" />
                    <Text style={styles.actionName}>
                      {videoDetail?.no_of_views}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={toggleLike}>
                    <View style={styles.action}>
                      {videoDetail?.isLiked ? (
                        <AntDesign name="like1" size={24} color="black" />
                      ) : (
                        <AntDesign name="like2" size={24} color="black" />
                      )}
                      <Text style={styles.actionName}>
                        {videoDetail?.no_of_likes}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.action}>
                    <TouchableOpacity onPress={generateShaerableLink}>
                      <AntDesign
                        name="sharealt"
                        size={24}
                        color="black"
                        style={{ marginLeft: 5 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.recordContainer}>
                {recordingAdded ? (
                  isAudioPlaying ? (
                    <TouchableOpacity
                      style={styles.pause}
                      onPress={pauseRecording}
                    >
                      <AntDesign name="pause" size={24} color="#03B44D" />
                    </TouchableOpacity>
                  ) : isAudioBuff ? (
                    <View
                      style={{
                        justifyContent: "center",
                        marginRight: 10,
                      }}
                    >
                      <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.play} onPress={playSound}>
                      <FontAwesome name="play" size={24} color="#03B44D" />
                    </TouchableOpacity>
                  )
                ) : null}
                {recordingAdded ? (
                  <>
                    <View style={styles.recordRight}>
                      <View>
                        <Text style={styles.recordHeaderText}>
                          Recording 001
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.recordingTime}>
                            28 Sept, 2021
                          </Text>
                          <Text style={styles.recordingTime}>
                            {currentAudioDuration !== ""
                              ? `${currentAudioDuration}/`
                              : ""}
                            {totalAudioDuration}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={alertDeleteAudio}>
                        <MaterialCommunityIcons
                          name="delete-forever-outline"
                          size={34}
                          color="red"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.mic}>
                      <Feather name="mic" size={24} color="#03B44D" />
                    </View>
                    <View>
                      <Text style={styles.recordHeaderText}>
                        Record your own voice
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.replace("RhymesRecording", {
                            lullabyId: selectedId,
                            imageUrl: videoDetail?.imageUrl,
                            lyrics: videoDetail?.lyrics,
                          })
                        }
                      >
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.addVoice}
                          colors={["#19C190", "#F5B700"]}
                        >
                          <Text style={{ color: "white", fontSize: 16 }}>
                            Add Voice
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
              <Text style={styles.headerName}>Recommended Rhymes</Text>
            </>
          }
          renderItem={RenderItem}
          ListFooterComponent={loadingFooter}
          ListEmptyComponent={EmptyRecommendedList}
        />
      </SafeAreaView>

      <Spinner
        // visibility of Overlay Loading Spinner
        visible={isLoadingForShareLink}
        //Text with the Spinner
        textContent={"Creating link..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  desc: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(0,0,0,.7)",
    marginLeft: 5,
  },
  headerName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 50,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  recordContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 15,
    height: 80,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "#fff",
  },
  mic: {
    backgroundColor: "#D7FEE7",
    padding: 12,
    marginRight: 10,
    borderRadius: 20,
  },
  recordHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  addVoice: {
    borderRadius: 15,
    width: 96,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  play: {
    backgroundColor: "#D7FEE7",
    marginRight: 10,
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
    marginRight: 10,
  },
  recordRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingTime: {
    fontSize: 16,
    marginRight: 20,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundTxt: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

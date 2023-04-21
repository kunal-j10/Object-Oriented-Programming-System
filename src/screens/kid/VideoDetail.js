import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import * as ScreenOrientation from "expo-screen-orientation";
import Toast from "react-native-root-toast";
import Spinner from "react-native-loading-spinner-overlay";
import Share from "react-native-share";
import { StatusBar } from "expo-status-bar";

import Colors from "../../../constants/Colors";
import VideoCard from "../../components/VideoCard";
import {
  DynamicLinkSelector,
  DynamicLinkLoadingSelector,
} from "../../../store/dynamicLinks/selector";
import {
  recommendedVideoFetch,
  removeVideoDetail,
  toggleVideoLike,
  updateKidWatchHistory,
  videoDetailFetch,
  removeKidError,
} from "../../../store/kid/operation";
import { dynamicLinkFetch } from "../../../store/dynamicLinks/slice";
import {
  kidErrorSelector,
  KidListErrorSelector,
  KidListLoadingSelector,
  KidRecommendVideoSelector,
  Kidscreen3LoadingSelector,
  KidVideoDetailSelector,
} from "../../../store/kid/selector";
import { removeNoInternetAction } from "../../../store/auth/operation";
import { getDynamicLink } from "../../utils/generateDynamicLink";
import { navigationRef } from "../NavigationRefScreen";
import crashlytics from "@react-native-firebase/crashlytics";

export default function VideoDetail({ route }) {
  const [playing, setPlaying] = useState(false);
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);

  const videoRef = useRef(null);

  const { videoId } = route.params;
  const [selectedId, setSelectedId] = useState(videoId);

  // Geting data from store
  const isLoading = useSelector(Kidscreen3LoadingSelector);
  const isLoadingRecommend = useSelector(KidListLoadingSelector);
  const videoDetail = useSelector(KidVideoDetailSelector);
  const recommendVideos = useSelector(KidRecommendVideoSelector);
  const errorToast = useSelector(kidErrorSelector);
  const listError = useSelector(KidListErrorSelector);
  const dispatch = useDispatch();

  // displaying error generated when fetching video VideoDetail, toggleLike
  // useEffect(() => {
  //   if (errorToast !== "") {
  //     Toast.show(errorToast, {
  //       duration: Toast.durations.SHORT,
  //       shadow: true,
  //       animation: true,
  //       onHide: () => {
  //         // calls on toast's hide animation start.
  //         dispatch(removeKidError());
  //       },
  //     });
  //   }
  // }, [errorToast]);

  // generating dynamiclink for sharing the video
  const generateLink = async () => {
    try {
      setIsLoadingForShareLink(true);
      let link = await getDynamicLink({state: navigationRef.getRootState()});
      setIsLoadingForShareLink(false);

      const shareoptions = {
        url: link,
      };
      const ShareResponse = await Share.open(shareoptions);
    } catch (err) {
      crashlytics().recordError(err);
    }
  };
  // Removing previous video detail
  useEffect(() => {
    dispatch(removeVideoDetail());

    return () => {
      dispatch(removeNoInternetAction(videoDetailFetch.type));
      dispatch(removeNoInternetAction(recommendedVideoFetch.type));
    };
  }, []);

  // opening sharing modal
  // useEffect(() => {
  //   if (selectDlinkLoader == false) {
  //     customShare();
  //   }
  // }, [dispatch, selectDlink, selectDlinkLoader]);

  // const customShare = async () => {
  //   const shareoptions = {
  //     url: selectDlink,
  //   };
  //   try {
  //     const ShareResponse = await Share.open(shareoptions);
  //   } catch (err) {
  //     console.log("Error = ", err);
  //   }
  // };

  // Fetching video detail
  useEffect(() => {
    dispatch(videoDetailFetch(selectedId));
  }, [selectedId]);

  // Fetching recommended videos data
  useEffect(() => {
    if (!isLoading) {
      dispatch(
        recommendedVideoFetch({
          videoId: videoDetail?._id,
          category: videoDetail?.category,
        })
      );
    }
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(async () => {

      const elapsed_sec = await videoRef?.current?.getCurrentTime();
      const elapsed_ms = Math.floor(elapsed_sec * 1000);

      let duration = await videoRef?.current?.getDuration();
      duration = Math.floor(duration * 1000);

      const per = elapsed_ms / duration;
      if (per >= 0.85) {
        dispatch(
          updateKidWatchHistory({
            videoId: videoDetail?._id,
            status: "completed",
          })
        );
        clearInterval(interval);
      }
      
    }, 1000);

    if (!playing) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [videoDetail, playing]);

  const toggleLike = useCallback(() => {
    dispatch(toggleVideoLike(videoDetail?._id));
  }, [videoDetail?._id]);

  const onStateChange = useCallback((state) => {
    if (state === "playing" || state === "buffering") {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, []);

  const onReadyVideo = useCallback(
    () =>
      dispatch(
        updateKidWatchHistory({ videoId: videoDetail._id, status: "active" })
      ),
    [videoDetail]
  );

  const onFullScreenChange = useCallback(async (status) => {
    if (status) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.unlockAsync();
    }
  }, []);

  const EmptyRecommendedList = useMemo(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>
          {listError === ""
            ? !videoDetail || isLoadingRecommend
              ? ""
              : "No recommended video found!"
            : listError}
        </Text>
      </View>
    ),
    [listError, videoDetail, isLoadingRecommend]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const RenderItem = useCallback(
    ({ item }) => (
      <VideoCard
        videoImage={item.thumbnail}
        title={item.title}
        language={item.language}
        duration={item.duration}
        onPress={() => setSelectedId(item._id)}
      />
    ),
    []
  );

  const LoadingFooter = () =>
    isLoadingRecommend ? (
      <ActivityIndicator size="large" color={Colors.primary} />
    ) : null;
  const ListHeader = useMemo(
    () =>
      videoDetail && (
        <>
          {/* Video Player */}
          <View style={styles.content}>
            <Text style={styles.name}>{videoDetail.title}</Text>

            {/* Total Views, Like, and Share */}
            <View style={styles.actions}>
              <View
                style={{
                  flexBasis: "30%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.action}>
                  <Feather name="eye" size={24} color="black" />
                  <Text style={styles.actionName}>
                    {videoDetail.total_views}
                  </Text>
                </View>

                <TouchableOpacity onPress={toggleLike}>
                  <View style={styles.action}>
                    {videoDetail.isLiked ? (
                      <AntDesign name="like1" size={24} color="black" />
                    ) : (
                      <AntDesign name="like2" size={24} color="black" />
                    )}
                    <Text style={styles.actionName}>
                      {videoDetail.total_likes}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={generateLink}>
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
          <Text style={styles.headerName}>Recommended Rhymes</Text>
        </>
      ),
    [videoDetail]
  );
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          {/* Video Player */}
          <YoutubePlayer
            ref={videoRef}
            webViewStyle={{ opacity: 0.99 }}
            webViewProps={{
              renderToHardwareTextureAndroid: true,
              androidLayerType:
                Platform.OS === "android" && Platform.Version <= 22
                  ? "hardware"
                  : "none",
            }}
            height={235}
            play={true}
            videoId={videoDetail.videoId}
            onChangeState={onStateChange}
            onReady={onReadyVideo}
            onFullScreenChange={onFullScreenChange}
          />

          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ flexGrow: 1 }}
            data={recommendVideos}
            keyExtractor={keyExtractor}
            renderItem={RenderItem}
            ListFooterComponent={LoadingFooter}
            ListEmptyComponent={EmptyRecommendedList}
          />
        </>
      )}

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
  Headercontainer: {
    elevation: 50,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
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
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
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

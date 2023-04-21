import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";
import Spinner from "react-native-loading-spinner-overlay";
import Share from "react-native-share";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import ActivityContentCard from "../../../components/mom/activity/ActivityContentCard";
import ActivityContentAbout from "../../../components/mom/activity/ActivityContentAbout";
import ActivityContentSteps from "../../../components/mom/activity/ActivityContentSteps";
import ActivityContentComments from "../../../components/mom/activity/ActivityContentComments";
import {
  toggleLike,
  activityFetch,
  activityFetchLvl1Com,
  activityRemoveLvl1Com,
  activityRemoveError,
  activitiesViewsCount,
} from "../../../../store/activity/operation";
import {
  activityErrorSelector,
  RecommendedActivities,
  activitySelector,
} from "../../../../store/activity/selector";
import { removeNoInternetAction } from "../../../../store/auth/operation";
import { activityDetail } from "../../../../store/activity/operation";
import { getDynamicLink } from "../../../utils/generateDynamicLink";

const { height, width } = Dimensions.get("window");
import {
  activityDetailSelector,
  activityDetailLoadingSelector,
} from "../../../../store/activity/selector";
import Skelleton from "../../../components/loader/SkeletonLoader";
import { navigationRef } from "../../NavigationRefScreen";
import crashlytics from "@react-native-firebase/crashlytics";

const HEADER_EXPANDED_HEIGHT = height * 0.45;
const HEADER_COLLAPSED_HEIGHT = HEADER_EXPANDED_HEIGHT * 0.13;

let prevScrollY = 0;

export default ActivityContent = ({ route,navigation }) => {
  const { selectedActivityId, from, category } = route.params;

  const [section, setSection] = useState("About");
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);

  const ref = useRef(null);
  const scrollY = useRef(new Animated.Value(0));
  const activityDetails = useSelector(activityDetailSelector);
  const activityDetailLoading = useSelector(activityDetailLoadingSelector);

  const error = useSelector(activityErrorSelector);

  const dispatch = useDispatch();
  // Fetching activity detail
  useEffect(() => {
    dispatch(activityDetail(selectedActivityId));
    dispatch(activitiesViewsCount(selectedActivityId));
  }, [selectedActivityId]);

  useEffect(() => {
    return () => {
      prevScrollY = 0;
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(removeNoInternetAction(activityFetchLvl1Com.type));
    };
  }, []);

  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(activityRemoveError());
        },
      });
    }
  }, [error]);

  // Removing Previous Comments
  useEffect(() => {
    return () => dispatch(activityRemoveLvl1Com());
  }, [selectedActivityId]);

  // Fetching comments data for initial loading
  useEffect(() => {
    dispatch(
      activityFetchLvl1Com({
        activityId: selectedActivityId,
        status: "loading",
      })
    );
  }, [dispatch, selectedActivityId]);

  useEffect(() => {
    ref?.current?.scrollToOffset({
      offset: -prevScrollY,
    });
  }, [section]);

  const ToggleLike = useCallback(() => {
    dispatch(toggleLike(selectedActivityId));
  }, [selectedActivityId]);

  const translateY = scrollY.current.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, -HEADER_EXPANDED_HEIGHT + HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  translateY.addListener(({ value }) => {
    prevScrollY = value;
  });

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY.current },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  // generating dynamiclink for sharing the activity
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {activityDetailLoading == true ? (
        <View style={{ alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        <>
          <Animated.View
            style={[styles.header, { transform: [{ translateY }] }]}
          >
            <ActivityContentCard
              onShareClick={generateShaerableLink}
              isliked={activityDetails.isLiked}
              toggleLike={ToggleLike}
              views={activityDetails.no_of_views}
              like={activityDetails.no_of_likes}
              imageUrl={activityDetails.imageUrl}
              title={activityDetails.title}
              height={HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT}
            />

            {/* SECTION */}
            <View style={styles.categoriesContainer}>
              <View style={styles.categories}>
                <TouchableOpacity
                  style={[
                    styles.category,
                    {
                      borderBottomColor:
                        section == "About"
                          ? "black"
                          : "rgba(196, 196, 196, 0.4)",
                    },
                  ]}
                  onPress={() => {
                    setSection("About");
                    // scrollY.current = new Animated.Value(0);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryTitle,
                      {
                        color:
                          section === "About"
                            ? "black"
                            : "rgba(24, 20, 31, 0.6)",
                      },
                    ]}
                  >
                    About
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.category,
                    {
                      borderBottomColor:
                        section == "Steps"
                          ? "black"
                          : "rgba(196, 196, 196, 0.4)",
                    },
                  ]}
                  onPress={() => {
                    setSection("Steps");
                    // scrollY.current = new Animated.Value(0);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryTitle,
                      {
                        color:
                          section === "Steps"
                            ? "black"
                            : "rgba(24, 20, 31, 0.6)",
                      },
                    ]}
                  >
                    Steps
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.category,
                    {
                      borderBottomColor:
                        section == "Comments"
                          ? "black"
                          : "rgba(196, 196, 196, 0.4)",
                    },
                  ]}
                  onPress={() => {
                    setSection("Comments");
                    // scrollY.current = new Animated.Value(0);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryTitle,
                      {
                        color:
                          section === "Comments"
                            ? "black"
                            : "rgba(24, 20, 31, 0.6)",
                      },
                    ]}
                  >
                    Comments
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* SECTION */}
          <View style={{ flex: 1 }}>
            {section === "About" ? (
              <ActivityContentAbout
                about={activityDetails.about}
                id={activityDetails._id}
                status={activityDetails.status}
                paddingTop={HEADER_EXPANDED_HEIGHT}
                onScroll={handleScroll}
                ref={ref}
              />
            ) : section === "Steps" ? (
              <ActivityContentSteps
                steps={activityDetails.steps}
                paddingTop={HEADER_EXPANDED_HEIGHT}
                onScroll={handleScroll}
                ref={ref}
              />
            ) : (
              <ActivityContentComments
                selectedActivityId={selectedActivityId}
                paddingTop={HEADER_EXPANDED_HEIGHT}
                onScroll={handleScroll}
                ref={ref}
              />
            )}
          </View>

          <Spinner
            // visibility of Overlay Loading Spinner
            visible={isLoadingForShareLink}
            //Text with the Spinner
            textContent={"Creating link..."}
            //Text style of the Spinner Text
            textStyle={{ color: "#FFF" }}
          />
        </>
      )}
    </View>
  );
};

export const ActiivityContentOptions = ({ navigation, route }) => {
  return {
    headerTitle: () => (
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ fontSize: 20, maxWidth: width * 0.65 }}
      >
        {route.params.headerTitle}
      </Text>
    ),
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
          onPress={() => navigation.goBack()}
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
  header: {
    position: "absolute",
    backgroundColor: "#fff",
    left: 0,
    right: 0,
    width,
    zIndex: 1,
  },
  categoriesContainer: {
    height: HEADER_COLLAPSED_HEIGHT,
    width,
  },
  categories: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  category: {
    flex: 1,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

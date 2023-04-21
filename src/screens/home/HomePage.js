import React, { useEffect, useCallback, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { LinearTextGradient } from "react-native-text-gradient";

import Colors from "../../../constants/Colors";
import cloudMessaging from "../../utils/cloudMessaging";

import RecommendedVaccineCard from "../../components/mom/vaccine/RecommendedVaccineCard";
import HomeTextLoader from "../../components/loader/HomeTextLoader";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import ChildCard from "../../components/home/ChildCard";
import RecommendedActivityCard from "../../components/home/RecommendedActivity";
import VideoCard from "../../components/VideoCard";
import VideoSkelletonLoader from "../../components/loader/VideoSkelletonLoader";
import PostCard from "../../components/community/PostCard";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../../components/CarouselCardItem";
import RecipeCard from "../../components/mom/growth/recipe/RecipeCard";
import SectionScrollView from "../../components/home/SectionScrollView";

import {
  childrenDetailsSelector,
  authLoadingSelector,
  parentDetailsSelector,
} from "../../../store/auth/selector";
import {
  rhymesHomeRecommendVideosSelector,
  rhymesIsVideoRecomLoadingSelector,
} from "../../../store/rhymes/selector";
import { fetchRecommendRhymeVideos } from "../../../store/rhymes/operation";
import {
  RecommendedActivities,
  recommendedActivitiesLoader,
} from "../../../store/activity/selector";
import { recommendedActivitiesFetch } from "../../../store/activity/operation";
import {
  KidHomeRecommendVideoSelector,
  KidListLoadingSelector,
} from "../../../store/kid/selector";
import { recommendedVideoFetch } from "../../../store/kid/operation";
import {
  communityTrendingPostsSelector,
  communityIsTrendingPostsLoadSelector,
} from "../../../store/community/selector";
import {
  communityFetchTrendingPost,
  toggleLike,
} from "../../../store/community/operation";
import {
  homeVaccinesSelector,
  vaccinationIsLoadingSelector,
} from "../../../store/vaccination/selector";
import { vaccineFetch } from "../../../store/vaccination/operation";
import {
  homeSliderImageSelector,
  homeSliderImageLoadingSelector,
} from "../../../store/home/selector";
import { homeSliderfetch } from "../../../store/home/operation";
import {
  recommendedRecipesSelector,
  recommendedRecipesLoaderSelector,
} from "../../../store/recipe/selector";
import {
  firstTimeUser
} from "../../../store/auth/operation";
import { isFirstTimeSelector } from "../../../store/auth/selector";
import { recommendedRecipesfetch } from "../../../store/recipe/operation";
import { parentChildAddedSelector } from "../../../store/auth/selector";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const HomePage = (props) => {
  const { navigation } = props;

  const { width } = useWindowDimensions();

  const dispatch = useDispatch();

  const isFirstTime = useSelector(isFirstTimeSelector);
  const parentDetails = useSelector(parentDetailsSelector);
  const recommendedActivityVideos = useSelector(RecommendedActivities);
  const recommendRhymesVideos = useSelector(rhymesHomeRecommendVideosSelector);
  const recommendedRecipes = useSelector(recommendedRecipesSelector);
  const childProfileLoading = useSelector(authLoadingSelector);
  const childrenDetails = useSelector(childrenDetailsSelector);
  const recRecipeLoader = useSelector(recommendedRecipesLoaderSelector);
  const recActLoader = useSelector(recommendedActivitiesLoader);
  const recrhymeLoader = useSelector(rhymesIsVideoRecomLoadingSelector);
  const recommendKidVideos = useSelector(KidHomeRecommendVideoSelector);
  const isRecommendKidVideoLoad = useSelector(KidListLoadingSelector);
  const trendingPosts = useSelector(communityTrendingPostsSelector);
  const isTrendingPostsLoad = useSelector(communityIsTrendingPostsLoadSelector);
  const vaccines = useSelector(homeVaccinesSelector);
  const isVaccinesLoad = useSelector(vaccinationIsLoadingSelector);
  const homeSliderImg = useSelector(homeSliderImageSelector);
  const homeSliderLoading = useSelector(homeSliderImageLoadingSelector);
  const isChildAdded = useSelector(parentChildAddedSelector);
  const [index, setIndex] = useState(0);

  const isCarousel = useRef(null);

  useEffect(() => {
    let unsubscribe;

    const messageHandler = async () => {
      unsubscribe = await cloudMessaging(dispatch);
    };
    messageHandler();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isFirstTime == null) {
      dispatch(firstTimeUser(false));
    }
  }, []);

  useEffect(() => {
    dispatch(recommendedActivitiesFetch());
  }, [childrenDetails]);

  useEffect(() => {
    dispatch(recommendedRecipesfetch());
  }, [childrenDetails]);

  useEffect(() => {
    dispatch(homeSliderfetch());
  }, [childrenDetails]);

  useEffect(() => {
    // Fetching recommended videos (rhymes and kid), trending posts and vaccines
    dispatch(fetchRecommendRhymeVideos({ isHomeScreen: true }));

    dispatch(recommendedVideoFetch({ isHomeScreen: true }));

    dispatch(communityFetchTrendingPost(5));

    dispatch(
      vaccineFetch({
        category: "upcoming",
        status: "loading",
        isHomeScreen: true,
        limit: 5,
      })
    );
  }, [childrenDetails]);

  const renderRecommendedActivities = useCallback(
    ({ item }) => (
      <RecommendedActivityCard
        onClickActivity={() => {
          navigation.navigate("MomNavigator", {
            screen: "ActivitiesNavigator",
            params: {
              screen: "ActivityContent",
              params: {
                selectedActivityId: item._id,
                from: "home",
                category: item.category,
                headerTitle: item.title,
              },
            },
          });
        }}
        thumbnailUrl={item.thumbnailUrl}
        title={item.title}
        views={item.no_of_views}
        duration={item.duration}
        // category={item.category}
      />
    ),
    []
  );

  const renderRecommendRhymes = useCallback(
    ({ item }) => (
      <View style={{ width: width * 0.9 }}>
        <VideoCard
          videoImage={item.imageUrl}
          title={item.title}
          language={item.language}
          duration={item.duration}
          onPress={() =>
            navigation.navigate("MomNavigator", {
              screen: "LullabyRhymesNavigator",
              params: {
                screen: "RhymesVideoDetail",
                params: { lullabyId: item._id },
              },
            })
          }
        />
      </View>
    ),
    [width]
  );

  const renderRecommendKid = useCallback(
    ({ item }) => (
      <View style={{ width: width * 0.9 }}>
        <VideoCard
          videoImage={item.thumbnail}
          title={item.title}
          language={item.language}
          duration={item.duration}
          onPress={() =>
            navigation.navigate("Kid", {
              screen: "VideoDetail",
              params: { videoId: item._id },
            })
          }
        />
      </View>
    ),
    [width]
  );

  const renderTrendingPost = useCallback(
    ({ item }) => (
      <View style={{ width: width * 0.8, marginHorizontal: 16 }}>
        <PostCard
          parentDesc={item.parentDesc}
          no_of_likes={item.no_of_likes}
          no_of_views={item.no_of_views}
          no_of_comments={item.no_of_comments}
          onCommentPress={() =>
            navigation.navigate("CommunityScreen", {
              screen: "Comments",
              params: { selectedPostId: item._id },
            })
          }
          onProfilePress={(expertId) =>
            navigation.navigate("CommunityScreen", {
              screen: "ExpertProfile",
              params: { expertId },
            })
          }
          queryText={item.text}
          parentDetails={item.parent}
          isImageAvailable={item.isImageAvailable}
          imageUrl={item.imageList}
          onImagePress={(selectedImgUri) =>
            navigation.navigate("Gallery", {
              uriData: item.imageList,
              selectedImgUri,
            })
          }
          displayTimestamp={item.displayTimestamp}
          isExpertReplied={item.isExpertReplied}
          expertDetail={item.expert}
          expertReply={item.reply}
          isLiked={item.isLiked}
          profileVisibility={item.profileVisibility}
          toggleLike={() => dispatch(toggleLike(item._id))}
          postId={item._id}
          isThreeDotVis={false}
          isShareVis={false}
          isImageVis={false}
        />
      </View>
    ),
    [width]
  );

  const renderVaccine = useCallback(
    ({ item }) => (
      <RecommendedVaccineCard
        onPress={() =>
          navigation.navigate("MomNavigator", {
            screen: "Vaccination",
            params: { vaccineId: item._id },
          })
        }
        vaccineName={item.vaccineName}
        dueDate={item.dueDate}
        label={item.label}
        pricePerDose={item.pricePerDose}
      />
    ),
    [width]
  );
  const renderReccomendedRecipes = useCallback(({ item }) => (
    <View
      style={{ width: width * 0.5, marginHorizontal: 10, borderRadius: 20 }}
    >
      <RecipeCard
        thumbnail={item.thumbnail}
        title={item.title}
        width="100%"
        onPress={() =>
          navigation.navigate("MomNavigator", {
            screen: "RecipesNavigator",
            params: {
              screen: "RecipeDetail",
              params: { recipeId: item._id },
            },
          })
        }
      />
    </View>
  ));

  const activitesKeyExtractor = useCallback(({ _id }) => _id, []);

  const rhymesKeyExtractor = useCallback(({ _id }) => _id, []);

  const kidRecommendKeyExtractor = useCallback(({ _id }) => _id, []);

  const trendingPostKeyExtractor = useCallback(({ _id }) => _id, []);

  const vaccinesKeyExtractor = useCallback(({ _id }) => _id, []);
  const recipesKeyExtractor = useCallback(({ _id }) => _id, []);

  const communityNavigate = useCallback(
    () =>
      navigation.navigate("CommunityScreen", {
        screen: "Community",
      }),
    []
  );

  const activityNavigate = useCallback(
    () =>
      navigation.navigate("MomNavigator", { screen: "ActivitiesNavigator" }),
    []
  );

  const rhymesNavigate = useCallback(
    () =>
      navigation.navigate("MomNavigator", {
        screen: "LullabyRhymesNavigator",
      }),
    []
  );

  const kidNavigate = useCallback(() => navigation.navigate("Kid"), []);

  const vaccineNavigate = useCallback(
    () =>
      navigation.navigate("MomNavigator", {
        screen: "Vaccination",
      }),
    []
  );

  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={styles.container}
    >
      <StatusBar style="auto" backgroundColor="#03B44D" />

      {/* HOME STARTING */}

      <View style={styles.homeStart}>
        <View style={styles.header}>
          <Text style={{ color: "#A5A2A2", fontSize: 18 }}>Welcome</Text>
          {childProfileLoading ? (
            <HomeTextLoader style={{ height: windowHeight * 0.09 }} />
          ) : (
            <LinearTextGradient
              style={{
                color: "black",
                fontSize: windowHeight > 600 ? 33 : 24,
                fontWeight: "bold",
              }}
              locations={[0, 1]}
              colors={["#19C190", "#F5B700"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text>
                {parentDetails.name && parentDetails?.name.split(/(\s+)/)[0]}
              </Text>
            </LinearTextGradient>
          )}
        </View>
        {isChildAdded ? (
          <ChildCard navigation={props.navigation} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AddChild", {
                isAuth: true,
                buttonTitle1: "Cancel",
                buttonTitle2: "Add",
              });
            }}
            style={styles.addchildbtn}
          >
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={Colors.primary}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 5,
                color: "#A5A2A2",
              }}
            >
              Add Child
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* HOME STARTING */}
      <View>
        <SectionScrollView navigation={props.navigation} />
      </View>
      {homeSliderLoading ? (
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <LottieView
            source={require("../../../assets/lottie/planeSkelleton.json")}
            style={{ width: windowWidth * 0.6, height: 150 }}
            autoPlay
          />
          <LottieView
            source={require("../../../assets/lottie/planeSkelleton.json")}
            style={{ width: windowWidth * 0.6, height: 150 }}
            autoPlay
          />
        </View>
      ) : (
        <View style={{ marginHorizontal: -20 }}>
          <Carousel
            loop={true}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            autoplay={true}
            inactiveSlideOpacity={0.4}
            contentContainerCustomStyle={{
              position: "relative",
              marginTop: 20,
              marginLeft: -20,
            }}
            layout="default"
            layoutCardOffset={9}
            ref={isCarousel}
            data={homeSliderImg}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={(index) => setIndex(index)}
          />

          <Pagination
            dotsLength={homeSliderImg.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 10,
              height: 10,
              marginHorizontal: 0,
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.92)",
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </View>
      )}

      {/* <ExploreChild
        onpress={communityNavigate}
        title="Want to ask questions? Explore our community"
        paragraph="With hundreds of verified parents and caregivers, the community is one which is built on a passion for raising kids right!"
      /> */}
      {!recRecipeLoader ? (
        recommendedRecipes?.length === 0 ? null : (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>
                Recommended recipes for your kid{" "}
              </Text>

              <View style={styles.more}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={24}
                  color={Colors.primary}
                />
              </View>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 5 }}
              horizontal
              data={recommendedRecipes}
              keyExtractor={recipesKeyExtractor}
              ListHeaderComponent={() => <View style={{ marginLeft: 16 }} />}
              renderItem={renderReccomendedRecipes}
            />
          </View>
        )
      ) : (
        <VideoSkelletonLoader />
      )}

      {!recActLoader ? (
        recommendedActivityVideos?.length === 0 ? null : (
          <View style={{ marginVertical: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>Recommended Activity</Text>
              <Text onPress={activityNavigate} style={styles.more}>
                More
              </Text>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={recommendedActivityVideos}
              keyExtractor={activitesKeyExtractor}
              ListHeaderComponent={() => <View style={{ marginLeft: 16 }} />}
              renderItem={renderRecommendedActivities}
            />
          </View>
        )
      ) : (
        <VideoSkelletonLoader />
      )}

      {!recrhymeLoader ? (
        recommendRhymesVideos?.length === 0 ? null : (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>Recommended Rhymes</Text>
              <Text onPress={rhymesNavigate} style={styles.more}>
                More
              </Text>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={recommendRhymesVideos}
              keyExtractor={rhymesKeyExtractor}
              renderItem={renderRecommendRhymes}
            />
          </View>
        )
      ) : (
        <VideoSkelletonLoader />
      )}

      {!isTrendingPostsLoad ? (
        trendingPosts?.length === 0 ? null : (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>Trending Queries</Text>
              <Text onPress={communityNavigate} style={styles.more}>
                More
              </Text>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={trendingPosts}
              keyExtractor={trendingPostKeyExtractor}
              renderItem={renderTrendingPost}
            />
          </View>
        )
      ) : (
        <VideoSkelletonLoader />
      )}

      {childrenDetails.length > 0 ? (
        vaccines?.length === 0 ? null : !isVaccinesLoad ? (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>Upcoming Vaccination</Text>
              <Text onPress={vaccineNavigate} style={styles.more}>
                More
              </Text>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={vaccines}
              keyExtractor={vaccinesKeyExtractor}
              renderItem={renderVaccine}
            />
          </View>
        ) : (
          <VideoSkelletonLoader />
        )
      ) : null}

      {!isRecommendKidVideoLoad ? (
        recommendKidVideos?.length === 0 ? null : (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.activityHeader}>
              <Text style={styles.title}>Recommended videos for your kid</Text>
              <Text onPress={kidNavigate} style={styles.more}>
                More
              </Text>
            </View>
            <FlatList
              style={{ marginHorizontal: -20 }}
              showsHorizontalScrollIndicator={false}
              horizontal
              data={recommendKidVideos}
              keyExtractor={kidRecommendKeyExtractor}
              renderItem={renderRecommendKid}
            />
          </View>
        )
      ) : (
        <VideoSkelletonLoader />
      )}
    </ScrollView>
  );
};

export const HomeOptions = (navData) => {
  return {
    headerShown: true,
    headerTitleAlign: "center",
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerRight: () => {},
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="search"
          color="black"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  more: {
    textDecorationLine: "underline",
  },
  vaccineCard: {
    marginVertical: 12,
    marginHorizontal: 16,
    height: 120,
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  vaccineText: {
    fontSize: 18,
    marginTop: 12,
  },
  header: {
    flexDirection: "column",
    paddingTop: 0,
  },
  homeStart: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  addchildbtn: {
    padding: 10,
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    elevation: 5,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default HomePage;

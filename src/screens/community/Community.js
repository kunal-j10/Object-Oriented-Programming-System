import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableNativeFeedback,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Spinner from "react-native-loading-spinner-overlay";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { Transition, Transitioning } from "react-native-reanimated";
import Share from "react-native-share";

import CustomHeaderButton from "../../components/CustomHeaderButton";
import PostCard from "../../components/community/PostCard";
import Skelleton from "../../components/loader/SkeletonLoader";
import Colors from "../../../constants/Colors";
import {
  communityPostsSelector,
  communityPostReachedTillEndSelector,
  communityIsPostLoadingSelector,
  communityIsPostRefreshingSelector,
  communityErrorToastSelector,
  communityIsImagesUploadedSelector,
} from "../../../store/community/selector";
import { parentIdSelector } from "../../../store/auth/selector";
import {
  fetchPost,
  fetchExtraPost,
  toggleLike,
  changeIsImagesUploaded,
  removeErrorToast,
  communityIncrementViewCount,
  communityAddViewedPost,
} from "../../../store/community/operation";
import ExtraOptionCommunityModal from "../../components/community/ExtraOptionCommunityModal";
import {
  deleteToastSelector,
  reportToastSelector,
  deletePostsLoadingSelector,
  reportPostsLoadingSelector,
} from "../../../store/community/selector";
import { getDynamicLink } from "../../utils/generateDynamicLink";
import { emptySearchPost } from "../../../store/community/operation";
import { navigationRef } from "../NavigationRefScreen";

// dummy data for filter categories
const postCategories = [
  {
    id: 1,
    category: "All filters",
    value: null,
  },
  { id: "2", category: "Newborn health", value: "newborn_health" },
  { id: "3", category: "Dental Health", value: "dental_health" },
  { id: "4", category: "Vaccinations", value: "vaccinations" },
  { id: "5", category: "Activities", value: "activities" },
  {
    id: "6",
    category: "Emotional Development",
    value: "emotional_development",
  },
  { id: "7", category: "Breastfeeding", value: "breastfeeding" },
  { id: "8", category: "Post-Pregnancy", value: "post_pregnancy" },
  { id: "9", category: "Food Recipes", value: "food_recipes" },
  { id: "10", category: "Toilet Training", value: "toilet_training" },
  { id: "11", category: "Bathing", value: "bathing" },
  {
    id: "12",
    category: "Cognitive Development",
    value: "cognitive_development",
  },
  { id: "13", category: "Milestones", value: "milestones" },
  { id: "14", category: "Parenting Style", value: "parenting_style" },
  { id: "15", category: "Diaper Changing", value: "diaper_changing" },
  { id: "16", category: "Toddlers", value: "toddlers" },
  { id: "17", category: "Diet", value: "diet" },
];

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const postsViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

export default function Community({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [extraOptionModalVisible, setExtraOptionModalVisible] = useState(false);
  const [selectedId, setselectedId] = useState("");
  const [ispostMine, setisPostMine] = useState(null);
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);
  // Get data from redux store
  const isLoadingPost = useSelector(communityIsPostLoadingSelector);
  const isRefreshingPost = useSelector(communityIsPostRefreshingSelector);
  const isImagesUploaded = useSelector(communityIsImagesUploadedSelector);
  const posts = useSelector(communityPostsSelector);
  const postReachedTillEnd = useSelector(communityPostReachedTillEndSelector);
  const errorToast = useSelector(communityErrorToastSelector);
  const modalRef = useRef(null);
  const DeleteToast = useSelector(deleteToastSelector);
  const DeletePostLoading = useSelector(deletePostsLoadingSelector);
  const ReportToast = useSelector(reportToastSelector);
  const ReportPostLoading = useSelector(reportPostsLoadingSelector);
  const Id = useSelector(parentIdSelector);
  const dispatch = useDispatch();

  // const navigationState = useNavigationState(state => state)

  useEffect(() => {
    dispatch(emptySearchPost());
  }, [dispatch, navigation]);

  // dispatching increment view count api
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(communityIncrementViewCount());
    });

    return unsubscribe;
  }, [navigation]);

  //Toast for deleting posts
  useEffect(() => {
    if (DeleteToast !== "") {
      Toast.show(DeleteToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
    }
  }, [DeleteToast]);

  //Toast for Reporting post
  useEffect(() => {
    if (ReportToast !== "") {
      Toast.show(ReportToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
    }
  }, [ReportToast]);

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
    if (isImagesUploaded === true) {
      dispatch(changeIsImagesUploaded());
    }
  }, [isImagesUploaded]);

  //Generate shareable link for any post
  const generateShareableLink = async (postId) => {
    try {
      setIsLoadingForShareLink(true);
      let link = await getDynamicLink({
        state: navigationRef.getRootState(),
        isCommunity: true,
        selectedPostId: postId,
      });
      setIsLoadingForShareLink(false);

      const shareoptions = {
        url: link,
      };
      const ShareResponse = await Share.open(shareoptions);
    } catch (err) {
      console.log("Error = ", err);
    }
  };

  useEffect(() => {
    const category = postCategories.find(
      (postCategory) => postCategory.id === categoryId
    ).value;

    dispatch(fetchPost({ category, status: "loading" }));
  }, [dispatch, categoryId]);

  const toggleModal = () => {
    modalRef.current.animateNextTransition();
    setModalVisible((prev) => !prev);
  };

  // Function to load posts
  const loadPostsAsync = useCallback(() => {
    const category = postCategories.find(
      (postCategory) => postCategory.id === categoryId
    ).value;

    dispatch(fetchPost({ category, status: "refreshing" }));
  }, [categoryId]);

  const loadExtraPosts = useCallback(() => {
    const category = postCategories.find(
      (postCategory) => postCategory.id === categoryId
    ).value;

    dispatch(fetchExtraPost(category));
  }, [categoryId]);

  const handleEdit = (id) => {
    const post = posts.find((item) => item._id === id);
    setExtraOptionModalVisible(false);

    if (post.postType === "query") {
      navigation.navigate("ShareQuestion", { editPost: post });
    } else {
      navigation.navigate("SharePost", { editPost: post });
    }
  };

  const handleMethodItemsChanged = useCallback(({ viewableItems }) => {
    const ids = viewableItems.map((item) => item.key);
    dispatch(communityAddViewedPost(ids));
  }, []);

  // Render Post Flatlist item
  const renderPostItem = useCallback(
    ({ item }) => (
      <PostCard
        parentDesc={item.parentDesc}
        no_of_likes={item.no_of_likes}
        no_of_views={item.no_of_views}
        no_of_comments={item.no_of_comments}
        onCommentPress={() =>
          navigation.navigate("Comments", { selectedPostId: item._id })
        }
        onExpertProfilePress={() =>
          navigation.navigate("ExpertProfile", {
            expertId: item.expert.expertId,
          })
        }
        onContentPress={() => navigation.navigate("CommunityPost")}
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
        postedAt={item.postedAt}
        isExpertReplied={item.isExpertReplied}
        expertDetail={item.expert}
        expertReply={item.reply}
        isLiked={item.isLiked}
        profileVisibility={item.profileVisibility}
        toggleLike={() => dispatch(toggleLike(item._id))}
        postId={item._id}
        onPressDots={() => {
          if (item.parentId == Id) {
            setselectedId(item._id);
            setisPostMine(true);
          } else {
            setselectedId(item._id);
            setisPostMine(false);
          }
          setExtraOptionModalVisible(true);
        }}
        onShareClick={() => generateShareableLink(item._id)}
        profileImageurl={item.parent?.profileImageUrl}
        // Isprofileimage = {item.parent.hasOwnProperty("profileImageUrl") ? true:false}
        onParentProfilePress={(parentId) =>
          navigation.navigate("ParentProfile", { parentId: parentId })
        }
      />
    ),
    []
  );

  const loadingFooter = () =>
    postReachedTillEnd ? (
      <Text style={styles.flatListFooterStyle}>
        Your eyes have seen everything.🔥
      </Text>
    ) : (
      <ActivityIndicator size="large" color={Colors.primary} />
    );

  return (
    // <SafeAreaView>
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      {/* Filter Start*/}
      <View style={styles.filterContainer}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={postCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(object) => (
            <View
              style={{ borderRadius: 20, overflow: "hidden", marginRight: 10 }}
            >
              <TouchableNativeFeedback
                onPress={() => {
                  setCategoryId(object.item.id);
                }}
              >
                <View
                  style={{
                    ...styles.filtercategory,
                    backgroundColor:
                      categoryId === object.item.id ? "#03B44D" : "white",
                    borderColor:
                      categoryId === object.item.id ? "white" : "#999999",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        categoryId === object.item.id ? "white" : "#999999",
                    }}
                  >
                    {object.item.category}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          )}
        />
      </View>
      {/* Filter End */}

      {/* Post start*/}
      {isLoadingPost ? (
        <View style={{ alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={loadPostsAsync}
          refreshing={isRefreshingPost}
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          contentContainerStyle={{
            paddingHorizontal: "5%",
            paddingBottom: "5%",
          }}
          style={styles.postContainer}
          onEndReached={loadExtraPosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingFooter}
          onViewableItemsChanged={handleMethodItemsChanged}
          viewabilityConfig={postsViewabilityConfig}
        />
      )}

      {/* Post End*/}
      <ExtraOptionCommunityModal
        isModalVisible={extraOptionModalVisible}
        onCloseModal={() => setExtraOptionModalVisible(false)}
        ispostMine={ispostMine}
        postId={selectedId}
        handleEdit={handleEdit}
        navigation={navigation}
      />
      <Transitioning.View
        style={[styles.btnGrp, modalVisible && styles.openModalGrp]}
        ref={modalRef}
        transition={transition}
      >
        {modalVisible && (
          <View style={styles.openModal}>
            <Pressable
              style={styles.modalIconView}
              onPress={() => {
                const category = postCategories.find(
                  (postCategory) => postCategory.id === categoryId
                ).value;

                navigation.navigate("SharePost", { category });
                toggleModal();
              }}
            >
              <>
                <View style={styles.modalIcon}>
                  <Feather name="image" size={28} color="#4C4C4C" />
                </View>
                <Text style={styles.modalIconText}>Share a Post</Text>
              </>
            </Pressable>

            {/* Ask question button */}
            <Pressable
              style={styles.modalIconView}
              onPress={() => {
                const category = postCategories.find(
                  (postCategory) => postCategory.id === categoryId
                ).value;

                navigation.navigate("ShareQuestion", { category });
                toggleModal();
              }}
            >
              <>
                <View style={styles.modalIcon}>
                  <MaterialCommunityIcons
                    name="format-text"
                    size={28}
                    color="#4C4C4C"
                  />
                </View>
                <Text style={styles.modalIconText}>Ask a Question</Text>
              </>
            </Pressable>
          </View>
        )}
        <Pressable onPress={toggleModal}>
          <View style={[styles.openBtn, modalVisible && styles.closeBtn]}>
            <AntDesign name="plus" size={26} color="white" />
          </View>
        </Pressable>
      </Transitioning.View>

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

export const CommunityOptions = (navData) => {
  return {
    headerTitle: "Community",

    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 2,
      shadowOpacity: 0.1,
    },
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="search"
          color="black"
          iconName={"search-outline"}
          onPress={() => navData.navigation.navigate("SearchPost")}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="search"
          color="black"
          iconName={"md-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  filterContainer: {
    padding: 20,
    paddingTop: 15,
  },
  postContainer: {
    height: "100%",
  },
  header: {
    width: "100%",
    height: 62,
    backgroundColor: "#F8F8FA",
    flexDirection: "row",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  filtercategory: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  flatListFooterStyle: {
    fontSize: 15,
    color: "gray",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  btnGrp: {
    position: "absolute",
    right: 20,
    bottom: 50,
    borderRadius: 50,
  },
  openModalGrp: {
    top: -50,
    left: -50,
    bottom: -50,
    right: -50,
    paddingRight: 70,
    paddingBottom: 100,
    backgroundColor: "rgba(0,0,0,.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // transform: [{ rotate: "45deg" }],
  },
  openModal: {
    alignItems: "center",
  },
  openBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 10,
    borderRadius: 30,
    shadowRadius: 5,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    backgroundColor: Colors.primary,
  },
  closeBtn: {
    transform: [{ rotate: "45deg" }],
  },
  modalIconView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    maxWidth: 75,
  },
  modalIcon: {
    backgroundColor: "#fafafa",
    padding: 18,
    borderRadius: 50,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconText: {
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});

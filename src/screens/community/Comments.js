import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Spinner from "react-native-loading-spinner-overlay";
import Share from "react-native-share";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";

import ImageGrid from "../../components/ImageGrid";
import Colors from "../../../constants/Colors";
import UserAvatar from "../../components/UserAvtar";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import CreateComment from "../../components/community/CreateComment";
import FirstLevelComment from "../../components/community/FirstLevelComment";
import {
  fetchLvl1Com,
  removeLvl1Com,
  fetchLvl2Com,
  removeLvl2Com,
  addLvlCom,
  toggleLvlComLike,
  setReplyHandler,
  closeReplyHandler,
  removeErrorToast,
  communityCommentDelete,
  removeSuccessMessage,
} from "../../../store/community/operation";
import {
  communityComReachedTillEndSelector,
  communityErrorToastSelector,
  communityIsComLoadingSelector,
  communityIsComRefreshingSelector,
  communityLvl1comSelector,
  communityLvl1ParentNameSelector,
  communityLvl2comSelector,
  communitySuccessMessageSelector,
} from "../../../store/community/selector";
import { removeNoInternetAction } from "../../../store/auth/operation";
import { getDynamicLink } from "../../utils/generateDynamicLink";
import { communityDetail } from "../../../store/community/operation";
import {
  communityDetailSelector,
  communityDetailLoadingSelector,
} from "../../../store/community/selector";
import { navigationRef } from "../NavigationRefScreen";
import ExtraOptionModalComment from "../../components/community/ExtraOptionModalComment";
import useToast from "../../hooks/useToast";
import crashlytics from "@react-native-firebase/crashlytics";

export default function Comments({ navigation, route }) {
  const [lvl2Expanded, setLvl2Expanded] = useState([]);
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);
  const [isModalVis, setIsModalVis] = useState(false);
  const [selectedCommObj, setSelectedCommObj] = useState();

  const inputRef = useRef(null);

  const { selectedPostId } = route.params;

  const lvl1comments = useSelector(communityLvl1comSelector);
  const commentReachedTillEnd = useSelector(communityComReachedTillEndSelector);
  const lvl1ParentName = useSelector(communityLvl1ParentNameSelector);
  const lvl2comments = useSelector(communityLvl2comSelector);
  const isLoading = useSelector(communityIsComLoadingSelector);
  const isRefresh = useSelector(communityIsComRefreshingSelector);
  const communityDetails = useSelector(communityDetailSelector);
  const communityDetailsLoading = useSelector(communityDetailLoadingSelector);

  useToast(communityErrorToastSelector, removeErrorToast);
  useToast(communitySuccessMessageSelector, removeSuccessMessage);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(communityDetail({ postId: selectedPostId }));
  }, [selectedPostId]);

  // Removing Previous Comments
  useEffect(() => {
    return () => {
      dispatch(removeLvl1Com());
      dispatch(removeNoInternetAction(fetchLvl1Com.type));
    };
  }, []);

  useEffect(() => {
    // Fetching comments data for initial loading
    dispatch(fetchLvl1Com({ postId: selectedPostId, status: "loading" }));
  }, [dispatch, selectedPostId]);

  // Fetching comments data for list refreshing
  const loadComments = useCallback(() => {
    dispatch(fetchLvl1Com({ postId: selectedPostId, status: "refreshing" }));
  }, [selectedPostId]);

  // Toggle Lvl2 of given commentId
  const toggleLvl2 = (commentId, status) => {
    if (status) {
      setLvl2Expanded([...lvl2Expanded, commentId]);
    } else {
      setLvl2Expanded(lvl2Expanded.filter((id) => id !== commentId));
    }
  };

  // Add Comment for given post
  const addComment = (comment) => {
    comment = comment.trim();
    if (comment === "") {
      return;
    }
    dispatch(addLvlCom({ postId: selectedPostId, comment }));
    Keyboard.dismiss();
  };

  const replyHandler = (lvl1ComId, lvl1ParentName) => {
    dispatch(setReplyHandler({ lvl1ComId, lvl1ParentName }));
    inputRef.current.focus();
  };

  const replyCLoseHandler = () => {
    dispatch(closeReplyHandler());
    Keyboard.dismiss();
  };

  const addExtra = () => {
    dispatch(fetchLvl1Com({ postId: selectedPostId }));
  };

  const loadingFooter = () =>
    !commentReachedTillEnd ? (
      <ActivityIndicator size="large" color={Colors.primary} />
    ) : (
      <Text style={styles.flatListFooterStyle}>--------- </Text>
    );

  //Generate shareable link for any post
  const generateShareableLink = async () => {
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

  const extraOptionModalOpen = (commentObj) => {
    setIsModalVis(true);
    setSelectedCommObj(commentObj);
  };

  const extraOptionModalClose = () => {
    setIsModalVis(false);
    setSelectedCommObj(null);
  };

  const deleteComment = (commentId, postId) => {
    Alert.alert(
      "Delete comment",
      "Are you sure, you want to delete these comment",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(communityCommentDelete({commentId,postId}));
            setIsModalVis(false);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const reportComment = (commentId) => {
    setIsModalVis(false);

    navigation.navigate("ReportSuggestion", {
      reportId: commentId,
      returnScreen: "Comments",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      {/* Appbar */}

      <View style={styles.appbar}>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="back"
            color="black"
            iconName={"chevron-back"}
            onPress={() => navigation.goBack()}
          />
        </HeaderButtons>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="sharealt"
            color="black"
            iconName="share-social-outline"
            onPress={generateShareableLink}
          />
        </HeaderButtons>
      </View>

      {/* Comments Section */}
      {communityDetailsLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={lvl1comments}
          refreshing={isRefresh}
          onRefresh={loadComments}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            //Profile Section
            <View style={styles.post}>
              {/* Profile Section */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ParentProfile", {
                    parentId: communityDetails.parent?.parentId,
                  })
                }
                style={styles.profileSection}
              >
                {communityDetails.parent?.profileImageUrl == null ? (
                  <UserAvatar
                    color={communityDetails.parent?.color}
                    nameInitial={communityDetails.parent?.nameinitials}
                    style={styles.profileIcon}
                    profileVisibility={communityDetails.profileVisibility}
                  />
                ) : (
                  <Image
                    source={{ uri: communityDetails.parent?.profileImageUrl }}
                    style={styles.profileIcon}
                  />
                )}

                <View style={styles.profileContent}>
                  <Text style={styles.profileName}>
                    {communityDetails.profileVisibility == "public"
                      ? communityDetails.parent.name
                      : "Anonymous"}
                  </Text>
                  <Text style={styles.profileProfession}>
                    {communityDetails.parentDesc}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* query asked */}
              <Text style={styles.query}>{communityDetails.text}</Text>
              {communityDetails.isImageAvailable ? (
                <ImageGrid
                  uriData={communityDetails.imageList}
                  onImagePress={(selectedImgUri) =>
                    navigation.navigate("Gallery", {
                      uriData: communityDetails.imageList,
                      selectedImgUri,
                    })
                  }
                />
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <FirstLevelComment
              data={item}
              lvl2Data={lvl2comments.filter(
                (comment) => comment.level1_comment_id === item._id
              )}
              lvl2Expanded={lvl2Expanded.includes(item._id)}
              setLvl2Expanded={toggleLvl2}
              replyHandler={replyHandler}
              fetchLvl2Com={(id) => dispatch(fetchLvl2Com(id))}
              removeLvl2Com={(id) => dispatch(removeLvl2Com(id))}
              toggleComLike={(commentObj) =>
                dispatch(toggleLvlComLike(commentObj))
              }
              extraOptionModalOpen={extraOptionModalOpen}
            />
          )}
          onEndReached={addExtra}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loadingFooter}
        />
      )}

      <CreateComment
        ref={inputRef}
        addComment={addComment}
        replyCLoseHandler={replyCLoseHandler}
        lvl1ParentName={lvl1ParentName}
      />

      <Spinner
        // visibility of Overlay Loading Spinner
        visible={isLoadingForShareLink}
        //Text with the Spinner
        textContent={"Creating link..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />
      <ExtraOptionModalComment
        isModalVis={isModalVis}
        commentObj={selectedCommObj}
        modalClose={extraOptionModalClose}
        deleteComment={deleteComment}
        reportComment={reportComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Constants.statusBarHeight,
  },
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 62,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.appbar,
    elevation: 2,
    shadowOpacity: 0.1,
    paddingHorizontal: 10,
  },
  post: {
    paddingHorizontal: 31,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(24, 20, 31, 0.2)",
    paddingBottom: 4,
  },
  profileSection: {
    flexDirection: "row",
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileContent: {
    flex: 1,
    marginLeft: 8,
    alignItems: "flex-start",
  },
  profileName: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileProfession: {
    fontSize: 12,
  },
  query: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 24,
  },
  flatListFooterStyle: {
    fontSize: 15,
    color: "gray",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 25,
  },
});

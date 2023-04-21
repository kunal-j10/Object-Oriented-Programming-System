import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  Keyboard,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchPost } from "../../../store/community/operation";
import ExtraOptionCommunityModal from "../../components/community/ExtraOptionCommunityModal";
import {
  searchedPostSelector,
  searchPostLoadingSelector,
  searchedPosterr,
} from "../../../store/community/selector";
import { getDynamicLink } from "../../utils/generateDynamicLink";
import { parentIdSelector } from "../../../store/auth/selector";
import { toggleLike } from "../../../store/community/operation";
import Skelleton from "../../components/loader/SkeletonLoader";
import PostCard from "../../components/community/PostCard";
import { emptySearchPost } from "../../../store/community/operation";
import Share from "react-native-share";
import Spinner from "react-native-loading-spinner-overlay";
import { BackHandler } from "react-native";
import { navigationRef } from "../NavigationRefScreen";
const SearchPost = (props) => {
  const [text, setText] = useState("");
  const [selectedId, setselectedId] = useState("");
  const [ispostMine, setisPostMine] = useState(null);
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);
  const [extraOptionModalVisible, setExtraOptionModalVisible] = useState(false);
  const dispatch = useDispatch();
  const Id = useSelector(parentIdSelector);
  const posts = useSelector(searchedPostSelector);
  const postsLoading = useSelector(searchPostLoadingSelector);
  const postsMessage = useSelector(searchedPosterr);

  const onPressSearch = () => {
    const trimmedText = text.trim();

    if (trimmedText !== text) setText(trimmedText);

    if (trimmedText === "") return;

    dispatch(searchPost({ searchKeyword: trimmedText }));
  };
  const onPressBack = () => {
    dispatch(emptySearchPost());
    props.navigation.navigate("Community");
  };

  const handleEdit = (id) => {
    const post = posts.find((item) => item._id === id);
    setExtraOptionModalVisible(false);

    if (post.postType === "query") {
      navigation.navigate("ShareQuestion", { editPost: post });
    } else {
      navigation.navigate("SharePost", { editPost: post });
    }
  };

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
    BackHandler.addEventListener("hardwareBackPress", () => {
      dispatch(emptySearchPost());
    });
  }, []);
  const renderPostItem = useCallback(
    ({ item }) => (
      <PostCard
        parentDesc={item.parentDesc}
        no_of_likes={item.no_of_likes}
        no_of_comments={item.no_of_comments}
        onCommentPress={() =>
          props.navigation.navigate("Comments", { selectedPostId: item._id })
        }
        onProfilePress={(expertId) =>
          props.navigation.navigate("ExpertProfile", { expertId: expertId })
        }
        onContentPress={() => props.navigation.navigate("CommunityPost")}
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
        isExpertReplied={item.isExpertReplied}
        expertDetail={item.expert}
        expertReply={item.reply}
        isLiked={item.isLiked}
        profileVisibility={item.profileVisibility}
        toggleLike={() => dispatch(toggleLike(item._id))}
        postId={item._id}
        onPressDots={() => {
          if (item.parent.parentId == Id) {
            setselectedId(item._id);
            setisPostMine(true);
          } else {
            setselectedId(item._id);
            setisPostMine(false);
          }
          setExtraOptionModalVisible(true);
        }}
        onShareClick={() => generateShareableLink(item._id)}
      />
    ),
    []
  );

  let content;
  if (postsMessage !== "") {
    content = (
      <View>
        <Text style={{ color: "red", fontSize: 20 }}>{postsMessage}</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPostItem}
        contentContainerStyle={{
          paddingHorizontal: "5%",
          paddingBottom: "5%",
        }}
        style={styles.postContainer}
      />
    );
  }

  return (
    <View onPress={() => Keyboard.dismiss()} style={styles.container}>
      <View style={styles.searchcontainer}>
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons name="md-chevron-back" size={24} />
        </TouchableOpacity>
        <TextInput
          autoFocus={true}
          placeholder="Search any query here.."
          onSubmitEditing={onPressSearch}
          onChangeText={setText}
          value={text}
          style={styles.textinput}
        />

        <TouchableOpacity onPress={onPressSearch}>
          <AntDesign name="search1" size={24} />
        </TouchableOpacity>
        <ExtraOptionCommunityModal
          isModalVisible={extraOptionModalVisible}
          onCloseModal={() => setExtraOptionModalVisible(false)}
          ispostMine={ispostMine}
          postId={selectedId}
          handleEdit={handleEdit}
          navigation={props.navigation}
        />
      </View>
      {postsLoading ? (
        <View style={{ alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        content
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
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchcontainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F8F8FA",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    height: 68,
    paddingHorizontal: 20,
  },
  textinput: {
    fontSize: 18,
    flexBasis: "80%",
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 2,
  },
  postContainer: {
    height: "100%",
  },
});

export default SearchPost;

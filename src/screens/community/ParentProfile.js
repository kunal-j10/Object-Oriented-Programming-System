import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import ProfileCard from "../../components/community/ProfileCard";
import PostCard from "../../components/community/PostCard.js";
import {
  parentprofileDetailsfecth,
  contentfetch,
  parentReportBlockfetch,
  emptyReportBlockStatus,
} from "../../../store/parentProfile/operation.js";
import Toast from "react-native-root-toast";
import Skelleton from "../../components/loader/SkeletonLoader";
import { getDynamicLink } from "../../utils/generateDynamicLink";
import { parentIdSelector } from "../../../store/auth/selector";
import {
  profileDetailSelector,
  profileDetailLoadingSelector,
  contentSelector,
  contentLoadingSelector,
  parentBlockReportLoading,
  parentBlockReportStatus,
} from "../../../store/parentProfile/selector";
import { toggleLike } from "../../../store/community/operation.js";
import { useDispatch, useSelector } from "react-redux";
import HomeTextLoader from "../../components/loader/HomeTextLoader";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import Spinner from "react-native-loading-spinner-overlay";
import { navigationRef } from "../NavigationRefScreen";
import ExtraOptionCommunityModal from "../../components/community/ExtraOptionCommunityModal";
import Share from "react-native-share";
import ProfileReportBlockModal from "../../components/community/ProfileReportBlockModal";
import crashlytics from "@react-native-firebase/crashlytics";
import ConfirmationBox from "../../components/ConfirmationBox";

const windowHeight = Dimensions.get("window").height;

const ParentProfile = (props) => {
  const parentId = props.route.params?.parentId;

  const dispatch = useDispatch();
  const ProfileDetails = useSelector(profileDetailSelector);
  const profileLoading = useSelector(profileDetailLoadingSelector);
  const content = useSelector(contentSelector);
  const Id = useSelector(parentIdSelector);
  const isLoading = useSelector(contentLoadingSelector);
  const reportBlockLoading = useSelector(parentBlockReportLoading);
  const reportBlockStatus = useSelector(parentBlockReportStatus);

  const [tab, settab] = useState("posts");
  const [extraOptionModalVisible, setExtraOptionModalVisible] = useState(false);
  const [profilereportBlockModal, setprofilereportBlockModal] = useState(false);
  const [ConfirmBox, setConfirmBox] = useState(false);
  const [type, settype] = useState("");
  const [isLoadingForShareLink, setIsLoadingForShareLink] = useState(false);
  const [selectedId, setselectedId] = useState("");
  const [ispostMine, setisPostMine] = useState(null);

  useEffect(() => {
    dispatch(parentprofileDetailsfecth({ parentId }));
  }, [parentId, dispatch]);

  const OnHandleReport = () => {
    setprofilereportBlockModal(false);
    settype("Report");
    setConfirmBox(true);
  };
  const OnHandleBlock = () => {
    setprofilereportBlockModal(false);
    if (ProfileDetails.isBlocked) {
      settype("UnBlock");
    } else {
      settype("Block");
    }
    setConfirmBox(true);
  };

  const HandleAction = (type) => {
    if (type == "Report") {
      dispatch(parentReportBlockfetch({ type: "report", Id: parentId }));
      dispatch(parentprofileDetailsfecth({ parentId }));
      setConfirmBox(false);
    }
    if (type == "Block" || type == "UnBlock") {
      dispatch(parentReportBlockfetch({ type: "block", Id: parentId }));
      dispatch(parentprofileDetailsfecth({ parentId }));
      setConfirmBox(false);
    }
  };

  useEffect(() => {
    if (tab == "posts") {
      dispatch(contentfetch({ parentId, type: "posts" }));
    } else if (tab == "questions") {
      dispatch(contentfetch({ parentId, type: "queries" }));
    } else {
      dispatch(contentfetch({ parentId, type: "answers" }));
    }
  }, [tab, parentId]);

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
      crashlytics().recordError(err);
    }
  };

  const handleEdit = (id) => {
    const post = content.find((item) => item._id === id);
    setExtraOptionModalVisible(false);

    if (post.postType === "query") {
      props.navigation.navigate("ShareQuestion", { editPost: post });
    } else {
      props.navigation.navigate("SharePost", { editPost: post });
    }
  };

  useEffect(() => {
    if (reportBlockStatus !== "") {
      Toast.show(reportBlockStatus, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
      dispatch(emptyReportBlockStatus());
    }
  }, [reportBlockStatus]);

  const Header = () => {
    return (
      <View>
        {!profileLoading ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            <ProfileCard
              onpressDot={() => setprofilereportBlockModal(true)}
              name={ProfileDetails.name}
              profileImageUrl={ProfileDetails.profileImageUrl}
              nameinitials={ProfileDetails.nameinitials}
              color={ProfileDetails.color}
            />
            {ProfileDetails.isBlocked ? (
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  backgroundColor: "red",
                  marginTop: 10,
                  borderRadius: 10,
                }}
              >
                <MaterialIcons name="report" size={22} color="white" />
                <Text style={{ color: "white" }}>
                  You have blocked this user!
                </Text>
              </View>
            ) : null}
            <View style={style.details}>
              <View style={style.detailsRow}>
                <MaterialIcons
                  name="article"
                  size={24}
                  color={Colors.primary}
                />
                <View style={style.detailsColumn}>
                  <Text style={style.number}>
                    {ProfileDetails.totalNoOfPosts}
                  </Text>
                  <Text style={style.text}>Posts</Text>
                </View>
              </View>

              <View style={style.detailsRow}>
                <MaterialCommunityIcons
                  name="file-question-outline"
                  size={24}
                  color={Colors.primary}
                />
                <View style={style.detailsColumn}>
                  <Text style={style.number}>
                    {ProfileDetails.totalNoOfQueries}
                  </Text>
                  <Text style={style.text}>Questions</Text>
                </View>
              </View>

              <View style={style.detailsRow}>
                <MaterialCommunityIcons
                  name="sticker-check-outline"
                  size={24}
                  color={Colors.primary}
                />
                <View style={style.detailsColumn}>
                  <Text style={style.number}>
                    {ProfileDetails.totalNoOfExpertAnsQuery}
                  </Text>
                  <Text style={style.text}>Answers</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <HomeTextLoader style={{ height: windowHeight * 0.18 }} />
        )}

        <View style={{ width: "100%", flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => settab("posts")}
            style={[
              style.tab,
              {
                borderBottomColor: tab == "posts" ? "black" : "#C4C4C4",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: tab == "posts" ? "black" : "#C4C4C4",
              }}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => settab("questions")}
            style={[
              style.tab,
              {
                borderBottomColor: tab == "questions" ? "black" : "#C4C4C4",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: tab == "questions" ? "black" : "#C4C4C4",
              }}
            >
              Questions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => settab("answers")}
            style={[
              style.tab,
              {
                borderBottomColor: tab == "answers" ? "black" : "#C4C4C4",
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: tab == "answers" ? "black" : "#C4C4C4",
              }}
            >
              Answers
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return isLoading == true ? (
      <View style={{ alignItems: "center" }}>
        <Skelleton />
      </View>
    ) : (
      <View style={{ padding: 20 }}>
        {item.count == 0 ? (
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              textAlign: "center",
              color: "#B2B2B2",
            }}
          >
            You have no {tab}
          </Text>
        ) : (
          <PostCard
            parentDesc={item.parentDesc}
            no_of_likes={item.no_of_likes}
            no_of_views={item.no_of_views}
            no_of_comments={item.no_of_comments}
            onCommentPress={() =>
              props.navigation.navigate("Comments", {
                selectedPostId: item._id,
              })
            }
            onExpertProfilePress={(expertId) =>
              props.navigation.navigate("ExpertProfile", { expertId: expertId })
            }
            onContentPress={() => props.navigation.navigate("CommunityPost")}
            queryText={item.text}
            parentDetails={item.parent}
            isImageAvailable={item.isImageAvailable}
            imageUrl={item.imageList}
            onImagePress={(selectedImgUri) =>
              props.navigation.navigate("Gallery", {
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
              props.navigation.navigate("ParentProfile", {
                parentId: parentId,
                owner: parentId == Id ? true : false,
              })
            }
          />
        )}
      </View>
    );
  };

  return (
    <>
      <FlatList
        contentContainerStyle={style.container}
        ListHeaderComponent={Header}
        data={content}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <ExtraOptionCommunityModal
        isModalVisible={extraOptionModalVisible}
        onCloseModal={() => setExtraOptionModalVisible(false)}
        ispostMine={ispostMine}
        postId={selectedId}
        handleEdit={handleEdit}
        navigation={props.navigation}
      />

      <ProfileReportBlockModal
        isBlock={ProfileDetails.isBlocked}
        OnHandleReport={OnHandleReport}
        OnHandleBlock={OnHandleBlock}
        parentId={parentId}
        isModalVisible={profilereportBlockModal}
        onCloseModal={() => setprofilereportBlockModal(false)}
      />
      <ConfirmationBox
        OnPressAction={() => HandleAction(type)}
        ModalLeftButton="Cancel"
        ModalRightButton={type}
        ModalTitle={`Do you want to ${type} ${ProfileDetails.name} ?`}
        isModalVisible={ConfirmBox}
        onCloseModal={() => setConfirmBox(false)}
      />
      <Spinner
        // visibility of Overlay Loading Spinner
        visible={isLoadingForShareLink}
        //Text with the Spinner
        textContent={"Creating link..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />

      <Spinner
        // visibility of Overlay Loading Spinner
        visible={reportBlockLoading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />
    </>
  );
};

export const ParentProfileOptions = (navData) => {
  return {
    headerTitle: "Profile",

    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 2,
      shadowOpacity: 0.1,
    }
  };
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  number: {
    color: "#18141F",
    fontSize: 12,
    fontWeight: "bold",
  },
  text: {
    color: "#18141F",
    fontSize: 12,
  },
  details: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 15,
  },
  detailsColumn: {
    marginLeft: 5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    justifyContent: "center",
    color: "black",
    flexBasis: "33.3333%",
    alignItems: "center",
    padding: 12,
  },
});

export default ParentProfile;

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import moment from "moment";

import UserAvatar from "../UserAvtar";
import Colors from "../../../constants/Colors";
import { getWordCount } from "../../utils/helper";
import ImageGrid from "../ImageGrid";
import { dynamicLinkFetch } from "../../../store/dynamicLinks/slice";

const PostCard = ({
  postId,
  parentDesc,
  no_of_likes,
  no_of_views,
  no_of_comments,
  onCommentPress,
  onExpertProfilePress,
  queryText,
  parentDetails,
  isImageAvailable,
  imageUrl,
  onImagePress,
  postedAt,
  isExpertReplied,
  expertDetail,
  expertReply,
  isLiked,
  profileVisibility,
  toggleLike,
  onPressDots,
  onShareClick,
  isThreeDotVis = true,
  isShareVis = true,
  isImageVis = true,
  profileImageurl,
  onParentProfilePress,
  // Isprofileimage
}) => {
  const [isReadMore, setIsReadMore] = useState(true);

  const dispatch = useDispatch();

  const generateLink = () => {
    dispatch(
      dynamicLinkFetch({
        param1: "screen",
        value1: "Comments",
        param2: "id",
        value2: postId,
      })
    );
  };
  // const [like, setlike] = useState(isLiked);

  // const animation = useRef(null);
  // const isFirstRun = useRef(true);

  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     if (like) {
  //       animation.current.play(72, 72);
  //     } else {
  //       animation.current.play(19, 19);
  //     }
  //     isFirstRun.current = false;
  //   } else if (like) {
  //     animation.current.play(19, 50);
  //   } else {
  //     animation.current.play(0, 19);
  //   }
  // }, [like]);

  // const toggleLikePost = () => {
  //   setlike(!like);
  //   toggleLike();
  // };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <View style={styles.card}>
      {/* SHow parent profile */}
      <View style={styles.cardheader}>
        <TouchableOpacity
          onPress={() => onParentProfilePress(parentDetails.parentId)}
        >
          <View style={{ flexDirection: "row" }}>
            {profileImageurl == null ? (
              <UserAvatar
                profileVisibility={profileVisibility}
                color={parentDetails?.color}
                nameInitial={parentDetails?.nameinitials}
                style={{ marginRight: 10 }}
              />
            ) : (
              <Image
                source={{ uri: profileImageurl }}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
            )}

            <View style={{ justifyContent: "space-around" }}>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", textAlign: "left" }}
              >
                {profileVisibility == "public"
                  ? parentDetails?.name
                  : "Anonymous"}
              </Text>
              <Text style={{ fontSize: 12 }}>{parentDesc}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {isThreeDotVis && (
          <TouchableOpacity onPress={onPressDots}>
            <Feather name="more-horizontal" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Show query asked by parent */}
      <Text
        style={[styles.queryText, !isImageVis && { minHeight: 66 }]}
        numberOfLines={isImageVis ? 0 : 3}
      >
        {queryText}
      </Text>
      {isImageVis && isImageAvailable ? (
        <ImageGrid uriData={imageUrl} onImagePress={onImagePress} />
      ) : null}
      {/* Show timestamp when this query/post was posted */}
      <View style={styles.moreInfo}>
        {(!isImageVis && getWordCount(queryText) > 15) ||
        (!isImageVis && isImageAvailable) ? (
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={onCommentPress}
          >
            read-more
          </Text>
        ) : (
          <View />
        )}
      </View>

      {/* Parent query end here */}

      {/* SHow expert reply */}

      {isExpertReplied ? (
        <View>
          <TouchableOpacity onPress={onExpertProfilePress}>
            <View style={styles.cardheader}>
              <View style={{ flexDirection: "row" }}>
                {expertDetail.profileImageUrl ? (
                  <Image
                    source={{ uri: expertDetail.profileImageUrl }}
                    style={{
                      height: 32,
                      width: 32,
                      borderRadius: 16,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <FontAwesome
                    style={{ marginRight: 10 }}
                    name="user-circle-o"
                    size={35}
                    color="black"
                  />
                )}
                <View style={{ justifyContent: "space-around" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {expertDetail.name}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {expertDetail.fieldOfSpecialty}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>...</Text>
            </View>
          </TouchableOpacity>
          {/* { Expert reply} */}

          {getWordCount(expertReply) < 20 ? (
            <Text
              style={{ fontSize: 16, fontWeight: "500", marginVertical: 20 }}
            >
              {expertReply}
            </Text>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", marginVertical: 20 }}
              >
                {isReadMore ? expertReply.slice(0, 50) : expertReply}
                <TouchableOpacity onPress={toggleReadMore}>
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 14,
                      marginLeft: 4,
                      textAlignVertical: "center",
                    }}
                  >
                    {isReadMore ? "Read more" : "Read less"}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          )}
        </View>
      ) : null}
      {/* Expert repy end here */}

      <Text
        style={{
          color: "gray",
          fontSize: 12,
          alignSelf: "flex-end",
          marginBottom: 5,
        }}
      >
        {moment(postedAt).calendar({ sameElse: "DD/MM/YYYY" })}
      </Text>

      <View
        style={{
          backgroundColor: "#DCDFE3",
          height: 1,
          marginBottom: 20,
          marginHorizontal: -20,
        }}
      />

      {/* Bottom like , comment share button */}
      <View style={styles.cardbottom}>
        <View style={{ flexDirection: "row" }}>
          {/* Like button */}
          <View style={styles.bottomIcon}>
            <TouchableOpacity onPress={toggleLike}>
              {/* <LottieView
              ref={animation}
              style={{
                ...styles.heartLottie,
                marginRight: no_of_comments > 0 ? "-6%" : "-10%",
              }}
              source={require("../../../assets/lottie/like.json")}
              autoPlay={false}
              loop={false}
            /> */}
              <AntDesign
                name={isLiked ? "heart" : "hearto"}
                size={23}
                color={isLiked ? "#DE1E26" : "black"}
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <Text>{no_of_likes > 0 && no_of_likes}</Text>
          </View>

          {/* Comment button */}
          <View style={styles.bottomIcon}>
            <TouchableOpacity onPress={onCommentPress}>
              <FontAwesome
                name={"comment-o"}
                size={24}
                color="black"
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
            <Text>{no_of_comments > 0 && no_of_comments}</Text>
          </View>

          {/* View Icon */}
          <View style={styles.bottomIcon}>
            <Feather
              name="eye"
              size={23}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text>{no_of_views > 0 && no_of_views}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          {/* <TouchableOpacity>
            <MaterialCommunityIcons
              name={"whatsapp"}
              size={23}
              color="#03B44D"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign
              name={"facebook-square"}
              size={23}
              color="#03B44D"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity> */}

          {isShareVis && (
            <TouchableOpacity onPress={onShareClick}>
              <AntDesign
                name={"sharealt"}
                size={23}
                color="black"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  cardheader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  cardbottom: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  bottomIcon: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 37,
    marginRight: 20,
  },
  heartLottie: {
    width: 60,
    height: 60,
    marginLeft: "-20%",
    marginTop: "-20%",
    marginBottom: -20,
  },
  queryText: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 20,
  },
  moreInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});

export default PostCard;

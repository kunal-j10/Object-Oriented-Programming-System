import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

import Colors from "../../../constants/Colors";
import UserAvatar from "../UserAvtar";

export default function CommentCard({
  data,
  replyHandler,
  toggleComLike,
  extraOptionModalOpen,
  onProfilePress,
}) {
  const user = data[data.userType ?? "parent"];

  return (
    <View
      style={[
        styles.container,
        data.no_of_level2_comments > 0 && { paddingBottom: 6 },
      ]}
    >
      {user ? (
        <TouchableOpacity onPress={onProfilePress}>
          {user?.profileImageUrl ? (
            <Image source={{ uri: user.profileImageUrl }} style={styles.icon} />
          ) : (
            <UserAvatar
              color={user.color}
              nameInitial={user.nameinitials}
              textStyle={{ fontSize: 10 }}
              style={data.userType === "expert" ? { margin: 0 } : styles.icon}
              profileVisibility={data.userType === "expert" ? "" : "public"}
              iconSize={29}
            />
          )}
        </TouchableOpacity>
      ) : null}
      <View style={styles.content}>
        <Text style={styles.name}>{user?.name}</Text>
        {data.userType === "expert" && (
          <Text style={styles.expertTitle}>Expert</Text>
        )}
        <Text style={styles.comment}>{data.comment}</Text>
        <View style={styles.likeReply}>
          <Text style={styles.likeReplyTxt}>{data.no_of_likes} likes</Text>
          {!data.level1_comment_id && user ? (
            <TouchableOpacity onPress={() => replyHandler(data._id, user.name)}>
              <Text style={styles.likeReplyTxt}>Reply</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => extraOptionModalOpen(data)}>
            <Feather name="more-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          toggleComLike({
            commentId: data._id,
            level1_comment_id: data.level1_comment_id,
          })
        }
      >
        <AntDesign
          name={data.isLiked ? "heart" : "hearto"}
          size={18}
          color="#DE1E26"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flexDirection: "row",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    marginLeft: 8,
    alignItems: "flex-start",
  },
  name: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  expertTitle: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 9,
  },
  comment: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  likeReply: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  likeReplyTxt: {
    fontSize: 12,
    marginRight: 16,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

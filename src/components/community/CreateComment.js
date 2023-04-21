import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { parentDetailsSelector } from "../../../store/auth/selector";
import UserAvatar from "../UserAvtar";
import {
  userColorSelector,
  userNamingInitialsSelector,
} from "../../../store/auth/selector";

export default CreateComment = React.forwardRef(
  ({ addComment, lvl1ParentName, replyCLoseHandler }, ref) => {
    const [comment, setComment] = useState("");

    const parentColor = useSelector(userColorSelector);
    const parentNameinitials = useSelector(userNamingInitialsSelector);
    const parentImage = useSelector(parentDetailsSelector);
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {lvl1ParentName !== "" && (
          <View style={styles.replyingHeader}>
            <Text>Replying to {lvl1ParentName}</Text>
            <TouchableOpacity onPress={replyCLoseHandler}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.writePost}>
          {parentImage.profileImageUrl == null ? (
            <UserAvatar
              color={parentColor}
              nameInitial={parentNameinitials}
              style={styles.postProfileIcon}
              profileVisibility="public"
            />
          ) : (
            <Image
              source={{ uri: parentImage.profileImageUrl }}
              style={styles.postProfileIcon}
            />
          )}
          <TextInput
            ref={ref}
            style={styles.postInput}
            value={comment}
            onChangeText={(val) => setComment(val)}
            multiline
            // textAlignVertical="top"
            placeholder="Leave your thoughts here...."
            placeholderTextColor="rgba(22, 43, 66, 0.6)"
          />
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => {
              setComment("");
              addComment(comment);
            }}
          >
            <Text
              style={[styles.postBtnTxt, comment !== "" && { color: "black" }]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
);

const styles = StyleSheet.create({
  replyingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(22,43,66,.15)",
    padding: 16,
  },
  writePost: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(22,43,66,.15)",
    padding: 16,
    maxHeight: 80,
  },
  postProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInput: {
    flex: 1,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  postBtn: {
    padding: 8,
  },
  postBtnTxt: {
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.3)",
  },
});

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { parentIdSelector } from "../../../store/auth/selector";
import Colors from "../../../constants/Colors";
import CommentCard from "./CommentCard";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function FirstLevelComment({
  data,
  lvl2Data,
  lvl2Expanded,
  setLvl2Expanded,
  replyHandler,
  fetchLvl2Com,
  removeLvl2Com,
  toggleComLike,
  extraOptionModalOpen,
}) {
  const navigation = useNavigation();

  const toggleLvl2 = () => {
    if (lvl2Expanded) {
      setLvl2Expanded(data._id, false);
      removeLvl2Com(data._id);
    } else {
      setLvl2Expanded(data._id, true);
      fetchLvl2Com(data._id);
    }
  };

  return (
    <View style={styles.container}>
      <CommentCard
        data={data}
        replyHandler={replyHandler}
        toggleComLike={toggleComLike}
        extraOptionModalOpen={extraOptionModalOpen}
        onProfilePress={() =>
          navigation.navigate(
            "CommunityScreen",
            data.userType === "parent"
              ? {
                  screen: "ParentProfile",
                  params: { parentId: data.userId },
                }
              : {
                  screen: "ExpertProfile",
                  params: { expertId: data.userId },
                }
          )
        }
      />

      {/* Level 2 Comments */}
      {data.no_of_level2_comments > 0 && (
        <View style={styles.lvl2List}>
          <TouchableOpacity onPress={toggleLvl2}>
            <Text style={styles.toggleReplies}>
              {lvl2Expanded ? "Hide Replies..." : "Show Replies..."}
            </Text>
          </TouchableOpacity>
          {lvl2Expanded &&
            lvl2Data.map((item) => (
              <CommentCard
                key={item._id}
                data={item}
                replyHandler={replyHandler}
                toggleComLike={toggleComLike}
                extraOptionModalOpen={extraOptionModalOpen}
                onProfilePress={() =>
                  navigation.navigate(
                    "CommunityScreen",
                    data.userType === "parent"
                      ? {
                          screen: "ParentProfile",
                          params: { parentId: data.userId },
                        }
                      : {
                          screen: "ExpertProfile",
                          params: { expertId: data.userId },
                        }
                  )
                }
              />
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  lvl2List: {
    paddingLeft: 40,
  },
  toggleReplies: {
    color: Colors.textSecondary,
  },
});

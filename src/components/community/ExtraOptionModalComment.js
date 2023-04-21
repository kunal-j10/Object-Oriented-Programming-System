import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { parentIdSelector } from "../../../store/auth/selector";

export default function ExtraOptionModalComment({
  isModalVis,
  modalClose,
  commentObj,
  deleteComment,
  reportComment,
}) {
  const parentId = useSelector(parentIdSelector);

  const userId =
    commentObj?.userType === "expert" ? commentObj.userId : commentObj?.parent?.parentId;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVis}
      statusBarTranslucent
      onRequestClose={modalClose}
    >
      <Pressable onPress={modalClose} style={styles.modalContainer}>
        <Pressable style={styles.modalView}>
          {userId === parentId ? (
            <TouchableOpacity
              style={styles.marBottom}
              onPress={() => deleteComment(commentObj._id,commentObj.postId)}
            >
              <View style={styles.listItem}>
                <MaterialIcons name="delete" size={26} color="red" />
                <Text style={styles.modalHeaderTxt}>Delete</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.marBottom}
              onPress={() => reportComment(commentObj._id)}
            >
              <View style={styles.listItem}>
                <MaterialIcons name="report" size={26} color="red" />
                <Text style={styles.modalHeaderTxt}>Report</Text>
              </View>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    paddingTop: 32,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  marBottom: {
    marginBottom: 10,
  },
  modalHeaderTxt: {
    flex: 1,
    fontSize: 16,
    color: "red",
    paddingHorizontal: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
});

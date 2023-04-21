import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableNativeFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { deletePost } from "../../../store/community/operation";
import Colors from "../../../constants/Colors";

const ExtraOptionCommunityModal = (props) => {
  const dispatch = useDispatch();
  const DeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure, you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => props.onCloseModal(),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deletePost({ postId: props.postId }));
            props.onCloseModal();
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const ReportPost = () => {
    props.navigation.navigate("ReportSuggestion", {
      reportId: props.postId,
      returnScreen: "Community",
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={props.isModalVisible}
      onRequestClose={props.onCloseModal}
    >
      <Pressable onPress={props.onCloseModal} style={styles.modalcontainer}>
        <Pressable style={styles.modalView}>
          {props.ispostMine === true ? (
            <>
              <TouchableOpacity
                style={styles.header}
                onPress={() => props.handleEdit(props.postId)}
              >
                <Feather name="edit-2" size={22} color={Colors.textSecondary} />

                <Text numberOfLines={1} style={styles.textstyle}>
                  Edit
                </Text>
              </TouchableOpacity>

              <View style={styles.seperator} />

              <TouchableOpacity style={styles.header} onPress={DeletePost}>
                <MaterialCommunityIcons name="delete" size={22} color="red" />

                <Text
                  numberOfLines={1}
                  style={[styles.textstyle, { color: "red" }]}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.header} onPress={ReportPost}>
              <MaterialIcons name="report" size={26} color="red" />

              <Text
                numberOfLines={1}
                style={[styles.textstyle, { color: "red" }]}
              >
                Report
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ExtraOptionCommunityModal;
const styles = StyleSheet.create({
  modalcontainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    paddingTop: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  textstyle: {
    flex: 1,
    fontSize: 16,
    color: "grey",
    paddingHorizontal: 8,
  },
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginVertical: 15,
    marginHorizontal: -20,
  },
});

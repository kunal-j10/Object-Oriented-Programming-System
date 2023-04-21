import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { parentReportBlockfetch } from "../../../store/parentProfile/operation";
import ConfirmationBox from "../ConfirmationBox";
import { useDispatch } from "react-redux";

const ProfileReportBlockModal = (props) => {
  // const [type, setType] = useState("");
  // const [modalVisible, setmodalVisible] = useState("false");
  // const dispatch = useDispatch();
  // const OnhandlePress = (type,parentId) => {
  //   console.log(type," ",parentId)
  //   dispatch(parentReportBlockfetch({type,Id: parentId}))
  // };

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
            <TouchableOpacity
              onPress={props.OnHandleReport}
              style={styles.header}
            >
              <MaterialIcons name="report" size={26} color="red" />

              <Text numberOfLines={1} style={styles.textstyle}>
                Report
              </Text>
            </TouchableOpacity>

            <View style={styles.seperator} />

            <TouchableOpacity
              onPress={props.OnHandleBlock}
              style={styles.header}
            >
              <MaterialCommunityIcons
                name="block-helper"
                size={22}
                color="red"
              />

              <Text
                numberOfLines={1}
                style={[styles.textstyle, { color: "red" }]}
              >
                {props.isBlock ? "Unblock" : "Block"}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
  );
};

export default ProfileReportBlockModal;

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
    marginVertical: 10,
    marginHorizontal: -20,
  },
});

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

const ExpertReportModal = (props) => {
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ExpertReportModal;

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

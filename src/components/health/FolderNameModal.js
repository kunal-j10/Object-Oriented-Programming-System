import React, { memo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import CustomInput from "../auth/CustomInput";

const FolderNameModal = ({
  nameModalVisible,
  nameModalClose,
  folderName,
  errorFolderName,
  setFolderName,
  createFolder,
  buttonTitle,
  placeholder,
  title,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={nameModalVisible}
      statusBarTranslucent
      onRequestClose={nameModalClose}
    >
      <Pressable onPress={nameModalClose} style={styles.modalContainer}>
        <Pressable style={styles.modalView}>
          {/* Folder Name Input Field */}
          <CustomInput
            value={folderName}
            error={errorFolderName}
            touched={true}
            onChange={(name) => setFolderName(name)}
            onBlur={() => {}}
            setFieldTouched={() => {}}
            placeholder={placeholder}
            title={title}
            maxLength={50}
            autoFocus
            onSubmitEditing={createFolder}
          />

          <View style={styles.modalFooter}>
            {/* Cancel button */}
            <TouchableOpacity
              style={{ flex: 1, marginRight: 15 }}
              onPress={nameModalClose}
            >
              <View
                style={[
                  styles.modalBtn,
                  { borderWidth: 1, borderColor: "red" },
                ]}
              >
                <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
              </View>
            </TouchableOpacity>

            {/* Create Folder or File Button */}
            <TouchableOpacity style={{ flex: 1 }} onPress={createFolder}>
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalBtn}
                colors={["#19C190", "#F5B700"]}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {buttonTitle}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default memo(FolderNameModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 16,
    paddingVertical: 32,
    paddingHorizontal: 15,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  modalBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
});

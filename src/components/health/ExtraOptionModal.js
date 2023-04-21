import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import Colors from "../../../constants/Colors";
import checkStoragePerm from "../../utils/checkStoragePerm";
import downloadFile from "../../utils/downloadFile";
import { healthDelFileOrFol } from "../../../store/health/operation";

const ExtraOptionModal = ({
  extraOptModalVis,
  selectedDoc,
  modalClose,
  setExtraOptModalVis,
  setNameModalVisible,
  setRenameDocId,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let fileType = [];
  if (selectedDoc.type === "file") {
    fileType = selectedDoc.fileType.split("--");
  }

  const downloadFileHandler = () => {
    setExtraOptModalVis(false);

    Toast.show("Item will be downloaded. See notifications for details", {
      duration: Toast.durations.SHORT,
      shadow: true,
      animation: true,
    });

    checkStoragePerm(() =>
      downloadFile({
        fileName: selectedDoc.name,
        fileType: fileType[0],
        fileUrl: selectedDoc.fileUrl,
      })
    );
  };

  const openImageHandler = () => {
    setExtraOptModalVis(false);

    navigation.navigate("Gallery", {
      uriData: [selectedDoc.fileUrl],
      selectedImgUri: selectedDoc.fileUrl,
    });
  };

  const openRenameModal = () => {
    setExtraOptModalVis(false);
    setRenameDocId(selectedDoc._id);
    setNameModalVisible(true);
  };

  const deleteFilOrFolder = () => {
    Alert.alert(
      `Delete ${selectedDoc.type}`,
      `Are you sure, you want to delete the ${selectedDoc.name} ${selectedDoc.type}`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setExtraOptModalVis(false);
            dispatch(healthDelFileOrFol(selectedDoc._id));
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={extraOptModalVis}
      statusBarTranslucent
      onRequestClose={modalClose}
    >
      <Pressable onPress={modalClose} style={styles.modalContainer}>
        <Pressable style={styles.modalView}>
          <View style={styles.modalHeader}>
            <FontAwesome
              name={
                selectedDoc.type === "folder"
                  ? "folder"
                  : `file-${fileType[1]}-o`
              }
              size={26}
              color={Colors.textSecondary}
            />
            <Text
              style={styles.modalHeaderTxt}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedDoc.name}
            </Text>
          </View>
          <View style={styles.seperator} />

          <TouchableOpacity style={styles.marBottom} onPress={openRenameModal}>
            <View style={styles.listItem}>
              <MaterialIcons
                name="drive-file-rename-outline"
                size={26}
                color={Colors.textSecondary}
              />
              <Text style={styles.modalHeaderTxt}>
                Rename {selectedDoc.type === "folder" ? "folder" : "file"}
              </Text>
            </View>
          </TouchableOpacity>

          {fileType[1] === "image" && (
            <TouchableOpacity
              style={styles.marBottom}
              onPress={openImageHandler}
            >
              <View style={styles.listItem}>
                <MaterialCommunityIcons
                  name="file-image-outline"
                  size={26}
                  color={Colors.textSecondary}
                />
                <Text style={styles.modalHeaderTxt}>Preview Image</Text>
              </View>
            </TouchableOpacity>
          )}
          {selectedDoc.type === "file" && (
            <TouchableOpacity
              style={styles.marBottom}
              onPress={downloadFileHandler}
            >
              <View style={styles.listItem}>
                <MaterialCommunityIcons
                  name="download"
                  size={26}
                  color={Colors.textSecondary}
                />
                <Text style={styles.modalHeaderTxt}>Download</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.marBottom}
            onPress={deleteFilOrFolder}
          >
            <View style={styles.listItem}>
              <MaterialCommunityIcons
                name="delete"
                size={26}
                color={Colors.textSecondary}
              />
              <Text style={styles.modalHeaderTxt}>Delete</Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default React.memo(ExtraOptionModal);

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
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalHeaderTxt: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingHorizontal: 8,
  },
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginBottom: 20,
    marginHorizontal: -20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  marBottom: {
    marginBottom: 10,
  },
});

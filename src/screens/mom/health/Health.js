import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import { Transition, Transitioning } from "react-native-reanimated";
import DocumentPicker, {
  isInProgress,
  types,
  isCancel,
} from "react-native-document-picker";
import Spinner from "react-native-loading-spinner-overlay";
import RNFetchBlob from "rn-fetch-blob";
import { StatusBar } from "expo-status-bar";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import Colors from "../../../../constants/Colors";
import Skeleton from "../../../components/loader/SkeletonLoader";
import FolderPreview from "../../../components/health/FolderPreview";
import FilePreview from "../../../components/health/FilePreview";
import FolderNameModal from "../../../components/health/FolderNameModal";
import {
  healthStorageFetch,
  healthCreateFolder,
  healthUploadFile,
  healthAddFolder,
  healthRemoveFolder,
  healthRename,
  healthChangeIsUploaded,
  healthRemoveSuccessMes,
  healthRemoveError,
} from "../../../../store/health/operation";
import {
  healthDriveSelector,
  healthFolderQueueSelector,
  healthFolderIdSelector,
  healthIsRefreshingSelector,
  healthIsLoadingSelector,
  healthIsUploadingSelector,
  healthIsUploadedSelector,
  healthSuccessMessageSelector,
  healthErrorListSelector,
  healthErrorSelector,
} from "../../../../store/health/selector";
import checkStoragePerm from "../../../utils/checkStoragePerm";
import downloadFile from "../../../utils/downloadFile";
import ExtraOptionModal from "../../../components/health/ExtraOptionModal";
import moment from "moment";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

export default Health = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [errorFolderName, setErrorFolderName] = useState(undefined);
  const [extraOptModalVis, setExtraOptModalVis] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [renameDocId, setRenameDocId] = useState();

  const modalRef = useRef(null);

  const drive = useSelector(healthDriveSelector);
  const folderQueue = useSelector(healthFolderQueueSelector);
  const folderId = useSelector(healthFolderIdSelector);
  const isRefreshing = useSelector(healthIsRefreshingSelector);
  const isLoading = useSelector(healthIsLoadingSelector);
  const isUploading = useSelector(healthIsUploadingSelector);
  const isUploaded = useSelector(healthIsUploadedSelector);
  const successMessage = useSelector(healthSuccessMessageSelector);
  const errorList = useSelector(healthErrorListSelector);
  const error = useSelector(healthErrorSelector);

  const dispatch = useDispatch();

  // Toast message for error
  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(healthRemoveError());
        },
      });
    }
  }, [error]);

  // Toast message for success
  useEffect(() => {
    if (successMessage !== "") {
      Toast.show(successMessage, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(healthRemoveSuccessMes());
        },
      });
    }
  }, [successMessage]);

  useEffect(() => {
    if (isUploaded === true) {
      toggleModal();
      dispatch(healthChangeIsUploaded());
    }
  }, [isUploaded]);

  useEffect(() => {
    dispatch(healthStorageFetch("loading"));
  }, [folderId]);

  // This function is invoked when pull to refresh the list feature is used
  const onRefresh = useCallback(() => {
    dispatch(healthStorageFetch("refreshing"));
  }, [folderId]);

  const toggleModal = useCallback(() => {
    modalRef.current.animateNextTransition();
    setModalVisible((prev) => !prev);
  }, []);

  const toggleNameModal = useCallback(() => {
    setNameModalVisible((prev) => !prev);
  }, []);

  const nameModalClose = useCallback(() => {
    setFolderName("");
    setErrorFolderName(undefined);
    setRenameDocId(null);
    toggleNameModal();
  }, []);

  const createFolder = useCallback(() => {
    const trimmedName = folderName.trim();

    if (trimmedName !== folderName) setFolderName(trimmedName);

    if (typeof trimmedName !== "string" || trimmedName === "") {
      setErrorFolderName("Name must be valid");
      return;
    }

    if (renameDocId) {
      dispatch(healthRename({ renameDocId, folderName: trimmedName }));
      setRenameDocId(null);
    } else {
      dispatch(healthCreateFolder(trimmedName));
    }
    setFolderName("");
    setErrorFolderName(undefined);
    toggleNameModal();
  }, [folderName]);

  const uploadFile = useCallback(async () => {
    try {
      const fileRes = await DocumentPicker.pick({
        type: [types.images, types.pdf],
        copyTo: "documentDirectory",
      });

      dispatch(
        healthUploadFile({
          name: fileRes[0].name,
          uri: fileRes[0].fileCopyUri,
          fileType: fileRes[0].type,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);
      if (isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (isInProgress(err)) {
      } else {
        console.log({ err });
      }
    }
  }, []);

  const extraOptModalClose = useCallback(() => {
    setExtraOptModalVis(false);
    setSelectedDoc({});
  }, []);

  const extraOptionHandler = (doc) => {
    setExtraOptModalVis(true);
    setSelectedDoc(doc);
  };

  const EmptyList = useCallback(() => {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>{errorList}</Text>
      </View>
    );
  }, [errorList]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Skeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {folderQueue.length !== 0 && (
          <View style={{ marginTop: 15, flexDirection: "row" }}>
            <TouchableOpacity onPress={() => dispatch(healthRemoveFolder())}>
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>
            <FlatList
              data={folderQueue}
              horizontal
              style={{ marginLeft: 6 }}
              ListFooterComponent={() => <View style={{ marginRight: 10 }} />}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => dispatch(healthRemoveFolder(item._id))}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.textPrimary,
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <Entypo name="chevron-right" size={25} color="black" />
                </View>
              )}
            />
          </View>
        )}
        <View style={styles.driveContainer}>
          {drive.length === 0 ? (
            <EmptyList />
          ) : (
            drive.map((item) => {
              if (item.type !== "folder") {
                return (
                  <FilePreview
                    key={item._id}
                    name={item.name}
                    fileType={item.fileType.split("--").pop()}
                    uri={item.fileUrl}
                    extraOptionHandler={() => extraOptionHandler(item)}
                  />
                );
              } else {
                return (
                  <FolderPreview
                    key={item._id}
                    name={item.name}
                    onPress={() => dispatch(healthAddFolder(item))}
                    extraOptionHandler={() => extraOptionHandler(item)}
                  />
                );
              }
            })
          )}
        </View>
      </ScrollView>

      <Transitioning.View
        style={styles.btnGrp}
        ref={modalRef}
        transition={transition}
      >
        {modalVisible && (
          <View style={styles.openModal}>
            {/* Create a Folder */}
            <Pressable
              style={styles.modalIconView}
              onPress={() => {
                toggleModal();
                toggleNameModal();
              }}
            >
              <>
                <View style={styles.modalIcon}>
                  <AntDesign name="addfolder" size={28} color="#4C4C4C" />
                </View>
                <Text style={styles.modalIconText}>Create Folder</Text>
              </>
            </Pressable>

            {/* Upload the File */}
            <Pressable style={styles.modalIconView} onPress={uploadFile}>
              <>
                <View style={styles.modalIcon}>
                  <AntDesign name="addfile" size={28} color="#4C4C4C" />
                </View>
                <Text style={styles.modalIconText}>Upload File</Text>
              </>
            </Pressable>
          </View>
        )}
        <Pressable onPress={toggleModal}>
          <View style={[styles.openBtn, modalVisible && styles.closeBtn]}>
            <AntDesign name="plus" size={24} color="white" />
          </View>
        </Pressable>
      </Transitioning.View>

      {/* Folder Name Modal */}
      <FolderNameModal
        nameModalVisible={nameModalVisible}
        nameModalClose={nameModalClose}
        folderName={folderName}
        errorFolderName={errorFolderName}
        setFolderName={setFolderName}
        createFolder={createFolder}
        buttonTitle={renameDocId ? "Rename" : "Create Folder"}
        placeholder={"Name"}
        title={"Enter Name"}
      />

      <ExtraOptionModal
        extraOptModalVis={extraOptModalVis}
        selectedDoc={selectedDoc}
        modalClose={extraOptModalClose}
        setExtraOptModalVis={setExtraOptModalVis}
        setNameModalVisible={setNameModalVisible}
        setRenameDocId={setRenameDocId}
      />

      <Spinner
        visible={isUploading}
        textContent="Uploading..."
        textStyle={{ color: "#FFF" }}
      />
    </View>
  );
};

export const HealthOptions = ({ navigation }) => {
  return {
    headerTitle: "Health Files",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundTxt: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  driveContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  btnGrp: {
    position: "absolute",
    right: "4%",
    bottom: "5%",
    // borderRadius: 32,
    // backgroundColor: "rgba(255,255,255,.7)",
  },
  openModal: {
    alignItems: "center",
  },
  openBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 10,
    borderRadius: 30,
    shadowRadius: 5,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    backgroundColor: Colors.primary,
  },
  closeBtn: {
    transform: [{ rotate: "45deg" }],
  },
  modalIconView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    maxWidth: 75,
  },
  modalIcon: {
    backgroundColor: "#fafafa",
    padding: 18,
    borderRadius: 50,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconText: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});

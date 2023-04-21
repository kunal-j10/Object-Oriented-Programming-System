import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  RefreshControl,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Transition, Transitioning } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";

import Colors from "../../../../constants/Colors";
import Skeleton from "../../../components/loader/SkeletonLoader";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import VaccinationListItem from "../../../components/mom/VaccinationListItem";
import DateInput from "../../../components/auth/DateInput";
import Button from "../../../components/Button";
import {
  vaccineFetch,
  vaccineStore,
  vaccineChangeIsUploaded,
  vaccineRemoveError,
} from "../../../../store/vaccination/operation";
import {
  vaccinesSelector,
  vaccinationIsLoadingSelector,
  vaccinationIsRefreshingSelector,
  vaccinationIsUploadingSelector,
  vaccinationIsUploadedSelector,
  vaccinationErrorDisplaySelector,
  vaccinationErrorSelector,
} from "../../../../store/vaccination/selector";
import {
  selectedChildIdSelector,
  childrenDetailsSelector,
} from "../../../../store/auth/selector";
import { removeNoInternetAction } from "../../../../store/auth/operation";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

export default Vaccination = ({ route, navigation }) => {
  const vaccineId = route.params?.vaccineId;
  const [selectedCategory, setSelectedCategory] = useState("Upcoming");
  const [selectedId, setSelectedId] = useState(vaccineId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedImages, setSelectedImages] = useState([]);
  const [errorDate, setErrorDate] = useState("");

  const ref = useRef();

  const selectedChildId = useSelector(selectedChildIdSelector);
  const childrenDetails = useSelector(childrenDetailsSelector);
  const vaccines = useSelector(vaccinesSelector);
  const isLoading = useSelector(vaccinationIsLoadingSelector);
  const isRefreshing = useSelector(vaccinationIsRefreshingSelector);
  const isImagesUploading = useSelector(vaccinationIsUploadingSelector);
  const isImagesUploaded = useSelector(vaccinationIsUploadedSelector);
  const errorDisplay = useSelector(vaccinationErrorDisplaySelector);
  const error = useSelector(vaccinationErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(removeNoInternetAction(vaccineFetch.type));
    };
  }, []);

  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(vaccineRemoveError());
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (isImagesUploaded === true) {
      setSelectedImages([]);
      setDate(new Date());
      toggleModal();

      dispatch(vaccineChangeIsUploaded());
    }
  }, [isImagesUploaded]);

  useEffect(() => {
    // Get Camera image url from navigation
    if (route?.params?.imageObject) {
      setIsModalVisible(true);

      setSelectedImages((prevState) => [
        ...prevState,
        route.params.imageObject,
      ]);
    }
  }, [route?.params?.imageObject]);

  useEffect(() => {
    dispatch(vaccineFetch({ category: selectedCategory, status: "loading" }));
  }, [selectedCategory]);

  // This function is invoked when pull to refresh the list feature is used
  const onRefresh = useCallback(() => {
    dispatch(
      vaccineFetch({ category: selectedCategory, status: "refreshing" })
    );
  }, [selectedCategory]);

  const EmptyList = () => {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>{errorDisplay}</Text>
      </View>
    );
  };

  //Open image picker
  const openImagePickerAsync = async () => {
    try {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access Media library is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (pickerResult.cancelled === true) {
        return;
      }
      const uri = pickerResult.uri;
      const fileName = uri.split("/").pop();
      const { size: sizeInBytes } = await FileSystem.getInfoAsync(uri, {
        size: true,
      });
      setSelectedImages((prevState) => [
        ...prevState,
        { uri, fileName, sizeInBytes },
      ]);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeImage = (uri) => {
    const remainingImages = selectedImages.filter((image) => image.uri !== uri);
    setSelectedImages(remainingImages);
  };

  const toggleModal = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const onDateChange = (name, date) => {
    setDate(date);
  };

  const editHandler = ({ takenOnDate, attachmentDetails }) => {
    setDate(new Date(takenOnDate));
    setSelectedImages(attachmentDetails);
    toggleModal();
  };

  const uploadVaccinationHandler = () => {
    const childrendata = childrenDetails.find(
      (child) => child._id === selectedChildId
    );
    const dob = childrendata.dob;

    if (moment(dob).isBefore(date, "D")) {
      dispatch(
        vaccineStore({
          category: selectedCategory,
          vaccineId: selectedId,
          takenOnDate: date.toISOString(),
          imagesUri: selectedImages,
        })
      );
    } else {
      setErrorDate("Vaccine Taken Date has to be after the birth date");
    }
  };

  const vaccineModalClose = () => {
    setSelectedImages([]);
    setDate(new Date());
    setErrorDate("");
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      {/* Header for categories selection */}
      <View style={styles.categories}>
        <TouchableOpacity
          style={[
            styles.category,
            {
              borderBottomColor:
                selectedCategory == "Upcoming"
                  ? "black"
                  : "rgba(196, 196, 196, 0.4)",
            },
          ]}
          onPress={() => {
            setSelectedId(null);
            setSelectedCategory("Upcoming");
          }}
        >
          <Text
            style={[
              styles.categoryTitle,
              {
                color:
                  selectedCategory === "Upcoming"
                    ? "black"
                    : "rgba(24, 20, 31, 0.6)",
              },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.category,
            {
              borderBottomColor:
                selectedCategory == "All"
                  ? "black"
                  : "rgba(196, 196, 196, 0.4)",
            },
          ]}
          onPress={() => {
            setSelectedId(null);
            setSelectedCategory("All");
          }}
        >
          <Text
            style={[
              styles.categoryTitle,
              {
                color:
                  selectedCategory === "All"
                    ? "black"
                    : "rgba(24, 20, 31, 0.6)",
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.category,
            {
              borderBottomColor:
                selectedCategory == "Completed"
                  ? "black"
                  : "rgba(196, 196, 196, 0.4)",
            },
          ]}
          onPress={() => {
            setSelectedId(null);
            setSelectedCategory("Completed");
          }}
        >
          <Text
            style={[
              styles.categoryTitle,
              {
                color:
                  selectedCategory === "Completed"
                    ? "black"
                    : "rgba(24, 20, 31, 0.6)",
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Data according to the selected category */}
      <Transitioning.View style={{ flex: 1 }} ref={ref} transition={transition}>
        {isLoading ? (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Skeleton />
          </View>
        ) : vaccines.length === 0 ? (
          <EmptyList />
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {/* For Header margin */}
            <View style={{ marginTop: 15 }}></View>

            {/* list of vaccines */}
            {vaccines.map((item) => (
              <VaccinationListItem
                ref={ref}
                key={item._id}
                id={item._id}
                vaccineName={item.vaccineName}
                pricePerDose={item.pricePerDose}
                dayToTake={item.dayToTake}
                description={item.description}
                dueDate={item?.dueDate}
                label={item?.label}
                showActionButton={item?.showActionButton}
                attachmentDetails={item?.attachmentDetails}
                takenOnDate={item?.takenOnDate}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                category={selectedCategory}
                markDoneHandler={toggleModal}
                editHandler={editHandler}
              />
            ))}

            {/* For Footer margin */}
            <View style={{ marginBottom: 20 }}></View>
          </ScrollView>
        )}
      </Transitioning.View>

      {/* Vaccination Tag Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={vaccineModalClose}
      >
        <Pressable onPress={vaccineModalClose} style={styles.modalContainer}>
          <Pressable style={styles.modalView}>
            <Text style={styles.modalHeader}>Save your Vaccination Tag</Text>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
              <Text style={styles.modalDescription}>
                Vaccination Tag can be found on the vaccination chart shared by
                your Pediatrician, take snap of that tag.
              </Text>

              {/* Vaccine Taken Date Input */}
              <DateInput
                name="dob"
                value={date}
                title="Vaccine Taken Date"
                error={errorDate}
                onChange={onDateChange}
                setIsModalVisible={setIsDateModalVisible}
                isModalVisible={isDateModalVisible}
              />

              {/* To Display Vaccination Tags  */}
              {selectedImages.length !== 0 && (
                <View style={{ marginBottom: 16 }}>
                  <View style={styles.separator} />
                  <Text style={styles.vaccTagTitle}>Vaccination Tags</Text>

                  {selectedImages.map(({ uri, fileName, sizeInBytes }) => {
                    let byteRepresent;

                    if (sizeInBytes >= 1048576) {
                      sizeInBytes = Math.round(sizeInBytes / 1048576);
                      byteRepresent = " MB";
                    } else if (sizeInBytes >= 1024) {
                      sizeInBytes = Math.round(sizeInBytes / 1024);
                      byteRepresent = " KB";
                    }

                    return (
                      <View
                        key={`${uri} ${fileName}`}
                        style={styles.vaccImageCont}
                      >
                        <View style={{ flexDirection: "row", maxWidth: "60%" }}>
                          <Image source={{ uri }} style={styles.vaccImage} />
                          <View>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.imageNameTitle}
                            >
                              {fileName}
                            </Text>
                            <Text style={{ color: Colors.textSecondary }}>
                              {sizeInBytes + byteRepresent}
                            </Text>
                          </View>
                        </View>

                        {/* delete image button */}
                        <TouchableOpacity onPress={() => removeImage(uri)}>
                          <MaterialIcons
                            name="delete-outline"
                            size={32}
                            color={Colors.textSecondary}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Gallery and camera buttons */}
              <View style={styles.btnContainer}>
                {/* Choose image from gallery */}
                <Pressable
                  onPress={openImagePickerAsync}
                  style={({ pressed }) => ({
                    alignItems: "center",
                    opacity: pressed ? 0 : 1,
                  })}
                >
                  <View style={styles.imageBtn}>
                    <Feather name="image" size={26} color="#03B44D" />
                  </View>
                  <Text style={styles.imageText}>Upload</Text>
                </Pressable>

                {/* Capture image from camera */}
                <Pressable
                  onPress={() => {
                    toggleModal();
                    navigation.navigate({
                      name: "Camera",
                      params: { returnScreen: "Vaccination" },
                      merge: true,
                    });
                  }}
                  style={({ pressed }) => ({
                    alignItems: "center",
                    opacity: pressed ? 0 : 1,
                  })}
                >
                  <View style={styles.imageBtn}>
                    <Feather name="camera" size={26} color="#03B44D" />
                  </View>
                  <Text style={styles.imageText}>Camera</Text>
                </Pressable>
              </View>
            </ScrollView>

            {/* Button to upload vaccination tag, and to send vaccine taken date to backend */}
            <Button
              style={{ marginTop: 8, marginHorizontal: 16 }}
              title="Save"
              onPress={uploadVaccinationHandler}
            />

            <Spinner
              visible={isImagesUploading}
              textContent="Uploading..."
              textStyle={{ color: "#FFF" }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const VaccinationOptions = ({ navigation }) => {
  return {
    headerShown: "true",
    headerTitle: "Vaccination",
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
  categories: {
    paddingTop: 20,
    flexDirection: "row",
  },
  category: {
    borderBottomWidth: 2,
    paddingBottom: 8,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 16,
    paddingVertical: 32,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  modalDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  separator: {
    marginTop: 16,
    marginHorizontal: 5,
    height: 1,
    backgroundColor: "#999",
  },
  vaccTagTitle: {
    marginVertical: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  vaccImageCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "#fff",
  },
  vaccImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 5,
    marginRight: 10,
  },
  imageNameTitle: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginVertical: 3,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginBottom: 16,
    marginTop: 16,
  },
  imageBtn: {
    padding: 25,
    borderRadius: 50,
    elevation: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    backgroundColor: "#fff",
  },
  imageText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginTop: 8,
  },
});

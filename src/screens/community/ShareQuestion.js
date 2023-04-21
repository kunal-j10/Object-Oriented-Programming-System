import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-root-toast";

import Colors from "../../../constants/Colors";
import UserAvatar from "../../components/UserAvtar";
import CategoryModal from "../../components/community/CategoryModal";
import VisibilityModal from "../../components/community/VisibilityModal";
import {
  userColorSelector,
  userNameSelector,
  userNamingInitialsSelector,
} from "../../../store/auth/selector";
import {
  createPost,
  removeErrorToast,
} from "../../../store/community/operation";
import {
  communityErrorToastSelector,
  communityIsImagesUploadedSelector,
  communityIsImagesUploadingSelector,
} from "../../../store/community/selector";
import { parentDetailsSelector } from "../../../store/auth/selector";

//Window width and height
const windowHeight = Dimensions.get("window").height;

const categories = [
  { _id: "1", name: "General", value: "general" },
  { _id: "2", name: "Newborn health", value: "newborn_health" },
  { _id: "3", name: "Dental Health", value: "dental_health" },
  { _id: "4", name: "Vaccinations", value: "vaccinations" },
  { _id: "5", name: "Activities", value: "activities" },
  { _id: "6", name: "Emotional Development", value: "emotional_development" },
  { _id: "7", name: "Breastfeeding", value: "breastfeeding" },
  { _id: "8", name: "Post-Pregnancy", value: "post_pregnancy" },
  { _id: "9", name: "Food Recipes", value: "food_recipes" },
  { _id: "10", name: "Toilet Training", value: "toilet_training" },
  { _id: "11", name: "Bathing", value: "bathing" },
  { _id: "12", name: "Cognitive Development", value: "cognitive_development" },
  { _id: "13", name: "Milestones", value: "milestones" },
  { _id: "14", name: "Parenting Style", value: "parenting_style" },
  { _id: "15", name: "Diaper Changing", value: "diaper_changing" },
  { _id: "16", name: "Toddlers", value: "toddlers" },
  { _id: "17", name: "Diet", value: "diet" },
];

export default function ShareQuestion(props) {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibilityModal, setVisibilityModal] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState("public");

  const inputRef = useRef(null);

  // Get Parent detail from store
  const parentName = useSelector(userNameSelector);
  const color = useSelector(userColorSelector);
  const nameInitial = useSelector(userNamingInitialsSelector);
  const isLoading = useSelector(communityIsImagesUploadingSelector);
  const isImagesUploaded = useSelector(communityIsImagesUploadedSelector);
  const errorToast = useSelector(communityErrorToastSelector);
  const parentImage = useSelector(parentDetailsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.route?.params?.editPost) {
      const editPost = props.route?.params?.editPost;

      setContent(editPost.text);
      setSelectedCategory(
        categories.find((item) => item.value === editPost.category)._id
      );
      setSelectedVisibility(editPost.profileVisibility);
      setSelectedImages(
        editPost.imageList.map((item) => ({ uri: item.fileUrl, ...item }))
      );
    } else {
      setSelectedCategory(categories[0]._id);
    }
  }, []);

  useEffect(() => {
    if (errorToast !== "") {
      Toast.show(errorToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(removeErrorToast());
        },
      });
    }
  }, [errorToast]);

  useEffect(() => {
    if (isImagesUploaded === true) {
      props.navigation.navigate("Community");
    }
  }, [isImagesUploaded]);

  useEffect(() => {
    // Get Camera image url from navigation
    if (props.route?.params?.imageObject) {
      setSelectedImages((prevState) => [
        ...prevState,
        props.route.params.imageObject,
      ]);
    }
  }, [props.route?.params?.imageObject]);

  //Open image picker
  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access Media library is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImages((prevState) => [...prevState, { uri: pickerResult.uri }]);
  };

  const toggleCategoryModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

  const changeCategory = useCallback((id) => {
    setSelectedCategory(id);
  }, []);

  const focusInput = () => {
    inputRef.current.blur();

    setTimeout(() => inputRef.current.focus(), 100);
  };
  const submitHandler = () => {
    const trimmedContent = content.trim();

    if (trimmedContent !== content) setContent(trimmedContent);

    toggleCategoryModal();
    if (trimmedContent === "") {
      focusInput();
      return;
    }

    const selectedCategoryValue = categories.find(
      (category) => category._id === selectedCategory
    ).value;

    dispatch(
      createPost({
        endpoint: "createQuery",
        text: trimmedContent,
        category: selectedCategoryValue,
        visibility: selectedVisibility,
        images: selectedImages,
        editPostId: props.route?.params?.editPost?._id,
        returnCategory: props.route.params.category,
      })
    );
  };

  const removeImage = (uri) => {
    const remainingImages = selectedImages.filter((image) => image.uri !== uri);

    setSelectedImages(remainingImages);
  };

  const toggleVisibilityModal = useCallback(() => {
    setVisibilityModal((prev) => !prev);
  }, []);

  const changeVisibility = useCallback((visibility) => {
    setSelectedVisibility(visibility);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="auto" backgroundColor="#03B44D" />

      {/* Appbar */}
      <View style={styles.appbar}>
        <Pressable
          style={styles.btnWrapperAppBar}
          onPress={() => props.navigation.navigate("Community")}
        >
          <AntDesign name="close" size={24} color="black" />
        </Pressable>
        <Text style={styles.appbarTitle}>Ask your question</Text>
        <Pressable
          style={styles.btnWrapperAppBar}
          onPress={toggleCategoryModal}
        >
          <Text
            style={[
              styles.postBtn,
              {
                color:
                  content === "" ? Colors.textSecondary : Colors.textPrimary,
              },
            ]}
          >
            Post
          </Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View style={styles.profileSection}>
        {parentImage.profileImageUrl == null ? (
          <UserAvatar
            color={color}
            nameInitial={nameInitial}
            profileVisibility="public"
          />
        ) : (
          <Image
            source={{ uri: parentImage.profileImageUrl }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
        )}
        <View style={styles.profileContent}>
          <Text style={styles.profileName}>{parentName} </Text>
          <Pressable
            style={styles.visibilityPicker}
            onPress={toggleVisibilityModal}
          >
            <Text style={styles.selectedVisibility}>{selectedVisibility}</Text>
            <AntDesign name="down" size={15} color={Colors.iconColor} />
          </Pressable>
        </View>
      </View>

      {/* Text area */}
      <TouchableWithoutFeedback onPress={focusInput}>
        <View style={{ flex: 1, minHeight: windowHeight * 0.1 }}>
          <TextInput
            ref={inputRef}
            style={styles.content}
            placeholder="What do you want to ask about?"
            multiline
            value={content}
            onChangeText={(value) => setContent(value)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Image and video preview container */}
      <View style={styles.imageVideoContainer}>
        {selectedImages.map(
          (image) =>
            image.uri !== null && (
              <View key={image.uri}>
                <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                {/* image controls */}
                <Pressable
                  onPress={() => removeImage(image.uri)}
                  style={styles.imgControl}
                >
                  <AntDesign name="close" size={24} color="white" />
                </Pressable>
              </View>
            )
        )}
      </View>

      {/* Bottom Icons */}
      <View style={styles.bottomIcons}>
        <Pressable
          onPress={() =>
            props.navigation.navigate({
              name: "Camera",
              params: { returnScreen: "ShareQuestion" },
              merge: true,
            })
          }
        >
          <Feather
            name="camera"
            size={24}
            color={Colors.iconColor}
            style={styles.iconStyle}
          />
        </Pressable>

        <Pressable onPress={openImagePickerAsync}>
          <Feather
            name="image"
            size={24}
            color={Colors.iconColor}
            style={styles.iconStyle}
          />
        </Pressable>
        {/* <Pressable onPress={() => {}}>
            <Feather
              name="more-horizontal"
              size={24}
              color={Colors.iconColor}
              style={styles.iconStyle}
            />
          </Pressable> */}
      </View>

      <Spinner
        // visibility of Overlay Loading Spinner
        visible={isLoading}
        //Text with the Spinner
        textContent={"Uploading..."}
        //Text style of the Spinner Text
        textStyle={{ color: "#FFF" }}
      />

      {/* Modal to show all available category  */}
      <CategoryModal
        closeModal={toggleCategoryModal}
        modalVisible={modalVisible}
        submitHandler={submitHandler}
        selectedCategory={selectedCategory}
        changeCategory={changeCategory}
        categories={categories}
      />

      {/* Dropdown Modal to show visibility  */}
      <VisibilityModal
        closeModal={toggleVisibilityModal}
        modalVisible={visibilityModal}
        selectedVisibility={selectedVisibility}
        changeVisibility={changeVisibility}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
  },
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    height: 62,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.appbar,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  btnWrapperAppBar: {
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  appbarTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  postBtn: {
    fontSize: 18,
    fontWeight: "500",
  },
  profileSection: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 24,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileContent: {
    flex: 1,
    marginLeft: 20,
    alignItems: "flex-start",
  },
  profileName: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 6,
  },
  visibilityPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 40,
  },
  selectedVisibility: {
    paddingRight: 8,
    textTransform: "capitalize",
  },
  content: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  bottomIcons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(22,43,66,.15)",
    paddingVertical: 23,
    paddingHorizontal: 4,
  },
  iconStyle: {
    paddingHorizontal: 12,
  },
  imageVideoContainer: {
    margin: 15,
  },
  thumbnail: {
    height: windowHeight * 0.45,
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 5,
  },
  imgControl: {
    position: "absolute",
    top: 10,
    right: 15,
    backgroundColor: "black",
    borderRadius: 50,
    padding: 5,
  },
});

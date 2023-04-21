import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Dimensions,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-root-toast";
import { parentDetailsSelector } from "../../../store/auth/selector";
import Colors from "../../../constants/Colors";
import UserAvatar from "../../components/UserAvtar";
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

//Window width and height
const windowHeight = Dimensions.get("window").height;

export default function SharePost(props) {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

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
      setSelectedImages([
        ...editPost.imageList.map((item) => ({
          ...item,
          uri: item.fileUrl,
          type: "image",
        })),
        ...editPost.videoList.map((item) => ({
          ...item,
          uri: item.fileUrl,
          type: "video",
        })),
      ]);
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

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImages((prevState) => [
      ...prevState,
      { uri: pickerResult.uri, type: pickerResult.type },
    ]);
  };

  const focusInput = () => {
    inputRef.current.blur();

    setTimeout(() => inputRef.current.focus(), 100);
  };

  const submitHandler = () => {
    const trimmedContent = content.trim();

    if (trimmedContent !== content) setContent(trimmedContent);

    if (trimmedContent === "") {
      focusInput();
      return;
    }

    dispatch(
      createPost({
        endpoint: "createNormalPost",
        text: trimmedContent,
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
        <Text style={styles.appbarTitle}>Share Post</Text>
        <Pressable style={styles.btnWrapperAppBar} onPress={submitHandler}>
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
        </View>
      </View>

      {/* Text area */}
      <TouchableWithoutFeedback onPress={focusInput}>
        <View style={{ flex: 1, minHeight: windowHeight * 0.15 }}>
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
              params: { returnScreen: "SharePost" },
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
        {/* <Pressable onPress={() => {}}>
          <Feather
            name="video"
            size={24}
            color={Colors.iconColor}
            style={styles.iconStyle}
          />
        </Pressable> */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: Colors.white,
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
    color: Colors.textSecondary,
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
    justifyContent: "center",
  },
  profileName: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 6,
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

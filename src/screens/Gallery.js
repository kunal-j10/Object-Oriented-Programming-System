import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default Gallery = ({ route, navigation }) => {
  const { uriData, selectedImgUri } = route.params;

  const [uri, setUri] = useState(selectedImgUri);
  const [uriList, setUriList] = useState(uriData);

  const previewRef = useRef(null);

  useEffect(() => {
    if (typeof uriData[0] !== "string") {
      setUriList(
        uriData.map((item) => (item.fileUrl ? item.fileUrl : item.uri))
      );
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof uriList[0] === "string") {
      previewRef.current.scrollTo({
        x: windowWidth * 0.38 * uriList.findIndex((item) => item === uri),
      });
    }
  }, [uriList]);

  const handleImagePress = (uriLarge) => {
    setUri(uriLarge);
    previewRef.current.scrollTo({
      x: windowWidth * 0.38 * uriList.findIndex((item) => item === uriLarge),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* close icon */}
      <TouchableOpacity onPress={handleClose}>
        <Ionicons
          name="close"
          color="#fff"
          size={30}
          style={styles.closeIcon}
        />
      </TouchableOpacity>

      {/* actual image */}
      <Image source={{ uri }} resizeMode="contain" style={styles.image} />

      {/* image preview */}
      <View style={styles.previewContainer}>
        {typeof uriList[0] === "string" && (
          <ScrollView
            ref={previewRef}
            horizontal
            pagingEnabled
            contentContainerStyle={[
              styles.preview,
              uriList.length < 3 && { justifyContent: "center" },
            ]}
          >
            {uriList.map((item, idx) => (
              <Pressable key={idx} onPress={() => handleImagePress(item)}>
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.previewImg,
                    item === uri && styles.selectedPreview,
                  ]}
                />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Constants.statusBarHeight,
  },
  closeIcon: {
    alignSelf: "flex-end",
    padding: 10,
  },
  image: {
    width: "100%",
    flex: 1,
  },
  previewContainer: {
    marginVertical: 10,
  },
  preview: {
    alignItems: "center",
    flexGrow: 1,
  },
  previewImg: {
    height: windowHeight * 0.15,
    width: windowWidth * 0.38,
    resizeMode: "cover",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedPreview: {
    borderColor: "#9EA0A2",
    borderWidth: 2,
    height: windowHeight * 0.17,
    width: windowWidth * 0.4,
  },
});

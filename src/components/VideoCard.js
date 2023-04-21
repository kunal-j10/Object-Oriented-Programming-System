import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

const windowHeight = Dimensions.get("window").height;

const VideoCard = ({ videoImage, title, language, duration, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.imgWrapper}>
          <Image
            style={styles.thumbnail}
            source={{
              uri: videoImage,
            }}
            resizeMode="cover"
          />

          {/* Play button, and Duration */}
          <View style={styles.imgInfo}>
            <Entypo
              name="controller-play"
              size={30}
              style={styles.playIcon}
              color="white"
            />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
          {title} | <Text style={styles.lang}>{language}</Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const propsCheck = (prev, curr) => {
  return (
    prev.videoImage === curr.videoImage &&
    prev.title === curr.title &&
    prev.language === curr.language &&
    prev.duration === curr.duration
  );
};

export default React.memo(VideoCard, propsCheck);

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  imgWrapper: {
    borderRadius: 15,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  thumbnail: {
    height: windowHeight * 0.23,
    width: "100%",
  },
  imgInfo: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    padding: 10,
    paddingLeft: 12,
    backgroundColor: "rgba(0,0,0,.3)",
    borderRadius: 50,
  },
  duration: {
    position: "absolute",
    bottom: 0,
    right: 0,
    color: "white",
    backgroundColor: "rgba(255,255,255,.5)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopLeftRadius: 15,
  },
  title: {
    fontSize: 14,
    textAlign: "justify",
  },
  lang: {
    textTransform: "capitalize",
  },
});

import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import icon from "../../../../assets/images/temp/playlist.png";

export default function PopularPlaylistCard({ thumbnail, title, onPress }) {
  const { width, height } = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.categoryContainer,
        {
          width: width * 0.35,
          marginHorizontal: width * 0.02,
          height: width * 0.35,
        },
      ]}
    >
      <ImageBackground
        source={icon}
        style={styles.categoryImage}
        resizeMode="cover"
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subTitleText}>Various Artists</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 18,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  titleContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  titleText: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 2,
  },
  subTitleText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
});

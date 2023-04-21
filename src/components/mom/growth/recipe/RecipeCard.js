import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";

import Colors from "../../../../../constants/Colors";

export default function RecipeCard(props) {
  const { title, thumbnail, width, onPress } = props;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <ImageBackground
        source={{ uri: thumbnail }}
        style={[styles.thumbnail, { width }]}
        resizeMode="cover"
      >
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    // borderWidth: 1,
    // borderColor: Colors.textSecondary,
    elevation: 8,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  thumbnail: {
    // height: 180,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    backgroundColor: Colors.textSecondary,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

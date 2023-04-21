import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";

export default function MusicQueueCard(props) {
  const {
    thumbnail,
    title,
    lang,
    isLiked,
    onPress,
    toggleLike,
    onExtraOptPress,
  } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.containerWrapper}>
      <View style={styles.container}>
        <Image
          source={{ uri: thumbnail }}
          resizeMode="cover"
          style={styles.thumbnail}
        />
        <View style={styles.flex}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.lang}>{lang}</Text>
        </View>
        <View style={styles.options}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={Colors.appPrimaryColor}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={onExtraOptPress} style={styles.iconBtn}>
            <MaterialIcons name="menu" size={24} color="black" />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 14,
    elevation: 6,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: 64,
    height: 64,
    marginRight: 16,
    borderRadius: 14,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
    textTransform: "capitalize",
  },
  lang: {
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  iconBtn: {
    padding: 5,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
  },
});

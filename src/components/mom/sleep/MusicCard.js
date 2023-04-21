import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";

export default function MusicCard(props) {
  const { thumbnail, title, lang, isLiked, onPress, toggleLike } = props;

  return (
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
        <TouchableOpacity style={styles.iconBtn} onPress={onPress}>
          <AntDesign name="play" size={24} color={Colors.appPrimaryColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    padding: 8,
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
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
  },
  lang: {
    color: Colors.textSecondary,
  },
  iconBtn: {
    padding: 5,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
  },
});

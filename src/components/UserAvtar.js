import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const UserAvatar = ({
  color,
  style,
  nameInitial,
  textStyle,
  profileVisibility,
  fontSize,
  iconSize
}) => {
  return profileVisibility == "public" ? (
    <View style={[{ backgroundColor: color }, styles.UserAvatar, style]}>
      <Text style={[textStyle,{fontSize:fontSize}]}>{nameInitial}</Text>
    </View>
  ) : (
    <FontAwesome
      style={[styles.anonymousAvatar, style]}
      name="user-circle-o"
      size={iconSize ?? 40}
      color="black"
    />
  );
};

const styles = StyleSheet.create({
  UserAvatar: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    padding: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 25,
  },
  anonymousAvatar: {
    margin: 5,
  },
});

export default UserAvatar;

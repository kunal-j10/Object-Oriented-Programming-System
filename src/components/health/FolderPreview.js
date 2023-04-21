import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";

import Colors from "../../../constants/Colors";

export default FolderPreview = ({ name, onPress, extraOptionHandler }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.folder}>
        <View style={{ maxWidth: 120 }}>
          <FontAwesome name="folder" size={130} color={Colors.textSecondary} />
          <Text
            style={styles.folderName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>
        <View style={styles.threeDot}>
          <TouchableOpacity onPress={extraOptionHandler}>
            <Entypo
              name="dots-three-vertical"
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  folder: {
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 6,
  },
  folderName: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: -5,
  },
  threeDot: {
    justifyContent: "flex-end",
  },
});

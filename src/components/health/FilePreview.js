import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../../constants/Colors";

export default FilePreviewv = ({ name, fileType, uri, extraOptionHandler }) => {
  const navigation = useNavigation();

  const Component = () => (
    <View style={styles.file}>
      <View style={styles.filePreview}>
        <FontAwesome
          name={`file-${fileType}-o`}
          size={115}
          color={Colors.textSecondary}
        />
        <Text style={styles.fileName} numberOfLines={2} ellipsizeMode="tail">
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
  );

  if (fileType === "image") {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Gallery", {
            uriData: [uri],
            selectedImgUri: uri,
          })
        }
      >
        <Component />
      </TouchableOpacity>
    );
  } else {
    return (
      <View>
        <Component />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  file: {
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 6,
  },
  filePreview: {
    maxWidth: 120,
    alignItems: "center",
  },
  fileName: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: 8,
  },
  threeDot: {
    justifyContent: "flex-end",
  },
});

import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import icon from "../../../../assets/images/temp/explore.png";

export default function ExploreCategoryCard({ thumbnail, onPress }) {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.categoryContainer,
        {
          width: width * 0.28,
          marginHorizontal: width * 0.02,
          height: width * 0.28,
        },
      ]}
    >
      <Image source={icon} style={styles.categoryImage} resizeMode="cover" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
});

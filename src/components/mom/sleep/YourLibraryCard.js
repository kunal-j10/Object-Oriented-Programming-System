import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import Colors from "../../../../constants/Colors";

export default function YourLibraryCard({ icon, title, onPress }) {
  const { width, height } = useWindowDimensions();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: width * 0.42,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.appPrimaryColor,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 50,
    overflow: "hidden",
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

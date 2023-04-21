import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  Dimensions
} from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
const HEIGHT  = Dimensions.get("window").height
const CustomHeader = ({
  style,
  onPressleftIcon,
  title,
  lefticon,
  righticon,
  onPressrightIcon
}) => {
    const isOpen = useDrawerStatus();
  return (
    <View style={style}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.Button,{ borderBottomLeftRadius: isOpen == "open" ? null :20,}]}
        colors={["#19C190", "#F5B700"]}
      >
        <TouchableOpacity onPress={onPressleftIcon}>
          <FontAwesome name={lefticon} size={24} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {title}
        </Text>
        <TouchableOpacity onPress={onPressrightIcon}>
          <Feather name={righticon} size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  Button: {
      left: 0,
      top:0,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomRightRadius: 20,
  },
});

export default CustomHeader;

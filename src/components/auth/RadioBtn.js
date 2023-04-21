import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../../constants/Colors";

export default function RadioBtn(props) {
  const { name, value, onChange } = props;
  return (
    <Pressable onPress={() => onChange(name)}>
      <View style={styles.radioBtn}>
        {value === name ? (
          <Ionicons name="radio-button-on" size={30} color={Colors.brandPrimary.default} />
        ) : (
          <Ionicons name="radio-button-off" size={30} color={Colors.brandPrimary.default} />
        )}
        <Text style={styles.radioTxt}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioTxt: {
    marginLeft: 10,
    marginRight: 20,
    textTransform: "capitalize",
    fontSize: 18,
    color: Colors.textSecondary,
  },
});

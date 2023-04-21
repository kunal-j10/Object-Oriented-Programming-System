import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import spacing from "../../constants/spacing";

export default function DefaultIconButton({
  onPress = () => {},
  Icon = null,
  primary = true,
  containerStyle = {},
  elevation = 0,
}) {
  let iconColor = Colors.white.default;
  let buttonColor = Colors.brandPrimary.default;

  if (!primary) {
    buttonColor = Colors.brandSecondary.dark;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: buttonColor, elevation },
        containerStyle,
      ]}
    >
      {Icon ? Icon({ color: iconColor }) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.level1,
    alignSelf: "flex-start",
    borderRadius: 80,
    margin: spacing.level0,
  },
});

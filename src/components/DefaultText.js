import React from "react";
import { StyleSheet, Text } from "react-native";

import Colors from "../../constants/Colors";
import defaultSizes from "../../constants/DefaultFontSizes";

export default function DefaultText({
  as = "nr",
  style = [{}],
  children = "",
  ...restProps
}) {
  return (
    <Text style={[styles.base, defaultSizes[as], ...style]} {...restProps}>
      {children}
    </Text>
  );
}

export const DefaultTextTypes = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  lb: "lb",
  lr: "lr",
  mb: "mb",
  mr: "mr",
  nb: "nb",
  nr: "nr",
  sb: "sb",
  sr: "sr",
};

const styles = StyleSheet.create({
  base: {
    color: Colors.black.light1,
  },
});

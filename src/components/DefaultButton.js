import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import DefaultFontSizes from "../../constants/DefaultFontSizes";
import spacing from "../../constants/spacing";

import DefaultText, { DefaultTextTypes } from "./DefaultText";

export default function DefaultButton({
  text = "",
  containerStyle = {},
  textStyle = {},
  type = DefaultButtonTypes.normal,
  outline = false,
  primaryOutline = true,
  secondaryOutline = false,
  isDisabled = false,
  isFullWidth = false,
  onPress = () => {},
  leadingIcon = null,
  trailingIcon = null,
}) {
  let as = DefaultTextTypes.mb;
  let textColor = Colors.white.default;
  let buttonColor = Colors.brandPrimary.default;
  let borderColor = Colors.brandPrimary.default;
  let borderWidth = 0;
  let paddingHorizontal = 5 * DefaultFontSizes.mb.fontSize;
  let paddingVertical = DefaultFontSizes.nb.fontSize;
  let marginIcon = DefaultFontSizes.mb.fontSize;

  if (type === DefaultButtonTypes.small) {
    as = DefaultTextTypes.nb;
    paddingHorizontal = 5 * DefaultFontSizes.nb.fontSize;
    paddingVertical = DefaultFontSizes.sb.fontSize;
    marginIcon = DefaultFontSizes.nb.fontSize;
  } else if (type === DefaultButtonTypes.medium) {
    as = DefaultTextTypes.lb;
    paddingHorizontal = 5 * DefaultFontSizes.lb.fontSize;
    paddingVertical = DefaultFontSizes.mb.fontSize;
    marginIcon = DefaultFontSizes.lb.fontSize;
  } else if (type === DefaultButtonTypes.large) {
    as = DefaultTextTypes.h6;
    paddingHorizontal = 5 * DefaultFontSizes.h6.fontSize;
    paddingVertical = DefaultFontSizes.lb.fontSize;
    marginIcon = DefaultFontSizes.h6.fontSize;
  }

  if (outline && primaryOutline) {
    buttonColor = Colors.white.default;
    textColor = Colors.brandPrimary.default;
    borderWidth = 1;
  }

  if (outline && secondaryOutline) {
    buttonColor = Colors.white.default;
    textColor = Colors.black.default;
    borderColor = Colors.brandSecondary.dark;
    borderWidth = 1;
  }

  if (isDisabled && outline) {
    textColor = Colors.grey.light1;
    borderColor = Colors.grey.light1;
  } else if (isDisabled && !outline) {
    buttonColor = Colors.grey.light1;
  }

  if (isFullWidth) {
    paddingHorizontal = spacing.level0;
  }

  if (isFullWidth && type === DefaultButtonTypes.small) {
    as = DefaultTextTypes.mb;
    paddingVertical = DefaultFontSizes.nb.fontSize;
  } else if (isFullWidth && type === DefaultButtonTypes.normal) {
    as = DefaultTextTypes.lb;
    paddingVertical = DefaultFontSizes.mb.fontSize;
  } else if (isFullWidth && type === DefaultButtonTypes.medium) {
    as = DefaultTextTypes.h6;
    paddingVertical = DefaultFontSizes.lb.fontSize;
  } else if (isFullWidth && type === DefaultButtonTypes.large) {
    as = DefaultTextTypes.h5;
    paddingVertical = DefaultFontSizes.h6.fontSize;
  }

  const CustomizedContainerstyle = [
    styles.baseContainer,
    {
      backgroundColor: buttonColor,
      borderColor,
      borderWidth,
      paddingHorizontal,
      paddingVertical,
    },
    isFullWidth
      ? {
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginVertical: spacing.level1,
        }
      : { alignSelf: "flex-start", margin: spacing.level1 },
    containerStyle,
  ];

  const Customizedtextstyle = [
    { color: textColor },
    styles.baseText,
    textStyle,
  ];

  const leadingIconStyle = {
    fontSize: marginIcon,
    marginRight: marginIcon,
    color: textColor,
  };

  const trailingIconStyle = {
    fontSize: marginIcon,
    marginLeft: marginIcon,
    color: textColor,
  };

  if (isDisabled) {
    return (
      <View style={CustomizedContainerstyle}>
        {leadingIcon ? leadingIcon(leadingIconStyle) : null}
        <DefaultText as={as} style={Customizedtextstyle}>
          {text}
        </DefaultText>
        {trailingIcon ? trailingIcon(trailingIconStyle) : null}
      </View>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={CustomizedContainerstyle}>
        {leadingIcon ? leadingIcon(leadingIconStyle) : null}
        <DefaultText as={as} style={Customizedtextstyle}>
          {text}
        </DefaultText>
        {trailingIcon ? trailingIcon(trailingIconStyle) : null}
      </TouchableOpacity>
    );
  }
}

export const DefaultButtonTypes = {
  small: "small",
  normal: "normal",
  medium: "medium",
  large: "large",
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  baseText: {
    fontWeight: "bold",
  },
});

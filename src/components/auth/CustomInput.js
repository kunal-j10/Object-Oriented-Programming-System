import React from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import Colors from "../../../constants/Colors";
import TouchableButton from "../TouchableButton";

export const LeadingText = ({ text, onPress }) => (
  <Text onPress={onPress} style={styles.leading}>
    {text}
  </Text>
);

export default CustomInput = React.forwardRef((props, ref) => {
  const {
    value,
    error,
    touched,
    onChange,
    onBlur,
    setFieldTouched,
    title,
    leadingTitle,
    countryCode,
    onCodePress,
    secureTextEntry,
    passwordVisible,
    setPasswordVisible,
    optional,
    style,
    ...inputProps
  } = props;

  const hasError = error && touched;

  let leading = null;
  let inputStyle = { paddingLeft: 20 };

  if (leadingTitle === "emailPhone") {
    if (value.length > 2) {
      inputStyle.paddingLeft = 8;
      if (!isNaN(value)) {
        leading = <LeadingText text={countryCode} onPress={onCodePress} />;
      } else {
        leading = <LeadingText text="@" />;
      }
    } else {
      inputStyle.paddingLeft = 20;
    }
  } else if (leadingTitle === "phone") {
    inputStyle.paddingLeft = 8;
    leading = <LeadingText text={countryCode} onPress={onCodePress} />;
  } else if (leadingTitle === "email") {
    inputStyle.paddingLeft = 8;
    leading = <LeadingText text="@" />;
  }

  return (
    <View style={[styles.container,style]}>
     {title == undefined ? null : (<Text style={styles.title}>
        {title} {optional && <Text style={styles.optional}>(optional)</Text>}
      </Text>)} 
      <View style={[styles.inputContainer, hasError && styles.errorInput]}>
        {leading}
        <TextInput
          ref={ref}
          style={[styles.textInput, inputStyle]}
          value={value}
          onChangeText={(text) => onChange(text)}
          onBlur={() => {
            setFieldTouched();
            onBlur();
          }}
          secureTextEntry={secureTextEntry && !passwordVisible}
          {...inputProps}
        />
        {secureTextEntry && value.length > 0 && (
          <TouchableButton onPress={() => setPasswordVisible(!passwordVisible)}>
            <Feather
              style={styles.trailing}
              name={!passwordVisible ? "eye" : "eye-off"}
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableButton>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
  },
  title: {
    marginBottom: 16,
    marginLeft: 5,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  optional: {
    fontWeight: "400",
    fontSize: 14,
    color: "#4C4C4C",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  leading: {
    paddingRight: 8,
    paddingLeft: 12,
    paddingVertical: 5,
    borderRightWidth: 1,
    color: Colors.textSecondary,
    minWidth: 42,
    textAlign: "center",
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingRight: 20,
    fontSize: 16
  },
  trailing: {
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
    marginLeft: 5,
  },
  errorInput: {
    borderColor: "red",
  },
});

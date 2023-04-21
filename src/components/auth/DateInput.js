import React from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getFullDate } from "../../utils/helper";
import Colors from "../../../constants/Colors";

export default function DateInput(props) {
  const {
    name,
    value,
    title,
    error,
    onChange,
    setIsModalVisible,
    isModalVisible,
    textstyle,
    disabled = false,
  } = props;

  const handleConfirm = (date) => {
    setIsModalVisible(false);
    onChange(name, date);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputTitle, textstyle]}>{title}</Text>
      <Pressable
        style={[
          styles.dateInput,
          props.textinputstyle,
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
      >
        <Text style={styles.date}>{getFullDate(value)}</Text>
        <Feather name="calendar" size={24} color="#999" />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <DateTimePickerModal
        isVisible={isModalVisible}
        mode="date"
        date={value || new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 7,
  },
  inputTitle: {
    marginBottom: 16,
    marginLeft: 5,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
    marginLeft: 5,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 48,
  },
  disabled: {
    backgroundColor: "#D6D6D6",
  },
  date: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

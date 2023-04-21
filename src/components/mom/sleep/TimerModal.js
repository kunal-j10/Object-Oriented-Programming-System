import React, { memo, useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../../../constants/Colors";

const TimerModal = ({
  onClose,
  onSubmit,
  isVisible,
  hour,
  min,
  sec,
  inputErr,
  setHour,
  setMin,
  setSec,
}) => {
  const minRef = useRef(null);
  const secRef = useRef(null);

  const handleMinFocus = () => {
    minRef.current.focus();
  };

  const handleSecFocus = () => {
    secRef.current.focus();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.modalContainer}>
        <Pressable style={styles.modalView}>
          <Text style={styles.title}>Set Timer</Text>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.inputTitle}>Hours</Text>
              <TextInput
                style={styles.textInput}
                value={hour}
                onChangeText={(text) => setHour(text)}
                maxLength={2}
                placeholder="00"
                returnKeyType="next"
                onSubmitEditing={handleMinFocus}
              />
            </View>
            <View style={styles.flex}>
              <Text style={styles.inputTitle}>Minutes</Text>
              <TextInput
                ref={minRef}
                style={styles.textInput}
                value={min}
                onChangeText={(text) => setMin(text)}
                maxLength={2}
                placeholder="00"
                returnKeyType="next"
                onSubmitEditing={handleSecFocus}
              />
            </View>
            <View style={styles.flex}>
              <Text style={styles.inputTitle}>Seconds</Text>
              <TextInput
                ref={secRef}
                style={styles.textInput}
                value={sec}
                onChangeText={(text) => setSec(text)}
                maxLength={2}
                placeholder="00"
                onSubmitEditing={onSubmit}
              />
            </View>
          </View>

          {inputErr !== "" && <Text style={styles.errorText}>{inputErr}</Text>}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={{ flex: 1, marginRight: 15 }}
              onPress={onClose}
            >
              <View
                style={[
                  styles.modalBtn,
                  { borderWidth: 1, borderColor: "red" },
                ]}
              >
                <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1 }} onPress={onSubmit}>
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalBtn}
                colors={["#19C190", "#F5B700"]}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Start</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default memo(TimerModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 16,
    paddingVertical: 32,
    paddingHorizontal: 15,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  modalBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
  title: {
    marginVertical: 16,
    marginLeft: 5,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
  },
  flex: {
    flex: 1,
    marginHorizontal: 6,
  },
  inputTitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    paddingHorizontal: 5,
    fontSize: 16,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.appPrimaryColor,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
    marginLeft: 5,
  },
});

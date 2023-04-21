import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
const ConfirmationBox = ({
  isModalVisible,
  onCloseModal,
  ModalTitle,
  ModalLeftButton,
  ModalRightButton,
  OnPressAction,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onCloseModal}
    >
      <Pressable onPress={onCloseModal} style={styles.centeredView}>
        <View style={[{ backgroundColor: "white" }, styles.modalView]}>
          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {ModalTitle}
          </Text>
          {/* Button to navigate to Ask question on share post screen */}
          <View style={styles.buttonarea}>
            {/* Ask question button */}

            <TouchableOpacity style={styles.button} onPress={onCloseModal}>
              <View>
                <Text style={[styles.buttontxt, { color: "black" }]}>
                  {ModalLeftButton}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Publish a post button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red" }]}
              onPress={OnPressAction}
            >
              <View>
                <Text style={styles.buttontxt}>{ModalRightButton}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationBox;

const styles = StyleSheet.create({
  modalView: {
    width: "80%",
    minHeight: 150,
    marginTop: "auto",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: "70%",
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    flexBasis: "45%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonarea: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  buttontxt: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});

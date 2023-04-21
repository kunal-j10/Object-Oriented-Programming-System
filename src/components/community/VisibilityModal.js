import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

function VisibilityModal({
  modalVisible,
  closeModal,
  changeVisibility,
  selectedVisibility,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                  <View >
                  <Text style={styles.modalHeaderTxt}>
                    How do you want to show your identity ?
                  </Text>
                  </View>
                <TouchableOpacity onPress={closeModal}>
                  <AntDesign name="closecircle" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => changeVisibility("public")}>
                  <View style={styles.radioBtn}>
                    <View style={styles.radioItem}>
                      <MaterialIcons name="public" size={24} color="black" />
                      <Text style={styles.radioTxt}>Public</Text>
                    </View>
                    {selectedVisibility === "public" ? (
                      <Ionicons
                        name="radio-button-on"
                        size={24}
                        color="black"
                      />
                    ) : (
                      <Ionicons
                        name="radio-button-off"
                        size={24}
                        color="black"
                      />
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeVisibility("anonymous")}>
                  <View style={styles.radioBtn}>
                    <View style={styles.radioItem}>
                      <MaterialIcons name="block" size={24} color="black" />
                      <Text style={styles.radioTxt}>Anonymous</Text>
                    </View>
                    {selectedVisibility === "anonymous" ? (
                      <Ionicons
                        name="radio-button-on"
                        size={24}
                        color="black"
                      />
                    ) : (
                      <Ionicons
                        name="radio-button-off"
                        size={24}
                        color="black"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const propsCheck = (prev, curr) => {
  return (
    prev.selectedVisibility === curr.selectedVisibility &&
    prev.modalVisible === curr.modalVisible
  );
};

export default React.memo(VisibilityModal, propsCheck);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  modalHeaderTxt: {
    fontSize: 15,
    fontWeight: "bold",
  },
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  radioItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  radioTxt: {
    marginLeft: 10,
  },
});

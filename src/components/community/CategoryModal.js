import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function CategoryModal({
  closeModal,
  submitHandler,
  selectedCategory,
  changeCategory,
  modalVisible,
  categories,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.modalHeader}>Select a Topic</Text>
                <View style={styles.modalList}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryButtonContainer,
                        selectedCategory === category._id
                          ? styles.selected
                          : styles.unSelected,
                      ]}
                      key={category._id}
                      onPress={() => changeCategory(category._id)}
                    >
                      <Text style={[styles.category]}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={{ flex: 1, marginRight: 15 }}
                    onPress={closeModal}
                  >
                    <View
                      style={[
                        styles.modalBtn,
                        { borderWidth: 1, borderColor: "#03B44D" },
                      ]}
                    >
                      <Text style={{ color: "#03B44D", fontSize: 16 }}>
                        Skip
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={submitHandler}>
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.modalBtn}
                      colors={["#19C190", "#F5B700"]}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Post</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const propsCheck = (prev, curr) => {
  return (
    prev.selectedCategory === curr.selectedCategory &&
    prev.modalVisible === curr.modalVisible
  );
};
export default React.memo(CategoryModal, propsCheck);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  modalList: {
    marginVertical: 24,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryButtonContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(51, 51, 51, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 16,
    margin: 4,
    minWidth: "18%",
  },
  category: {
    fontSize: 12,
    fontWeight: "500",

    textAlign: "center",
  },
  selected: {
    backgroundColor: "#03B44D",
    color: "white",
  },
  unSelected: {
    backgroundColor: "white",
    color: "black",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
});

import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import DateInput from "../../auth/DateInput";
import CustomInput from "../../auth/CustomInput";
import {
  growthAddDetails,
  growthRemoveError,
} from "../../../../store/growth/operation";
import { growthErrorSelector } from "../../../../store/growth/selector";
import Toast from "react-native-root-toast";

const weightSchema = Yup.object().shape({
  weight: Yup.number()
    .required("Please enter weight value greater than 0 kg")
    .min(1, "Please enter weight value greater than 0 kg")
    .max(99, "Please enter weight value less than 100 kg")
    .typeError("Please enter correct value for weight"),
});

const heightSchema = Yup.object().shape({
  height: Yup.number()
    .required("Please enter height value greater than 0 cm")
    .min(1, "Please enter height value greater than 0 cm")
    .max(199, "Please enter height value less than 200 cm")
    .typeError("Please enter correct value for height"),
});

const headSchema = Yup.object().shape({
  head: Yup.number()
    .required("Please enter head circle value greater than 0 cm")
    .min(1, "Please enter head circle value greater than 0 cm")
    .max(99, "Please enter head circle value less than 100 cm")
    .typeError("Please enter correct value for head"),
});

export default function AddGrowthDetail(props) {
  const { onClose, isVisible, type, editDate, editValue, editId } = props;

  const [dateVisible, setDateVisible] = useState(false);

  const formikRef = useRef(null);

  const error = useSelector(growthErrorSelector);

  const [initialVal, setInitialVal] = useState({});

  useEffect(() => {
    setInitialVal(
      type === "Weight"
        ? {
            date: editDate ? new Date(editDate) : new Date(),
            weight: editValue ?? "",
          }
        : type === "Height"
        ? {
            date: editDate ? new Date(editDate) : new Date(),
            height: editValue ?? "",
          }
        : {
            date: editDate ? new Date(editDate) : new Date(),
            head: editValue ?? "",
          }
    );
  }, [editDate, editValue]);

  // displaying errors if occured
  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(growthRemoveError());
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (isVisible) {
      formikRef?.current?.resetForm({});
    }
  }, [isVisible, editId]);

  const dispatch = useDispatch();

  const handleFormSubmit = (values) => {
    const date = values.date.toISOString();
    dispatch(growthAddDetails({ date, type, ...values, docId: editId }));
  };

  const handleClose = () => {
    formikRef.current.resetForm({});
    onClose();
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      validationSchema={
        type === "Weight"
          ? weightSchema
          : type === "Height"
          ? heightSchema
          : headSchema
      }
      initialValues={{
        ...initialVal,
      }}
      onSubmit={handleFormSubmit}
    >
      {({
        handleSubmit,
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        setFieldTouched,
        setFieldValue,
      }) => (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={handleClose}
        >
          <View style={styles.container}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>Add Growth Details</Text>

              <DateInput
                name="date"
                value={values["date"]}
                title="Date"
                error={errors["date"]}
                onChange={setFieldValue}
                setIsModalVisible={setDateVisible}
                isModalVisible={dateVisible}
                disabled={!!editId}
              />
              {type === "Weight" ? (
                <CustomInput
                  value={values["weight"]}
                  error={errors["weight"]}
                  touched={touched["weight"]}
                  onChange={handleChange("weight")}
                  onBlur={() => handleBlur("weight")}
                  setFieldTouched={() => setFieldTouched("weight")}
                  placeholder="Eg. 2"
                  title="Weight (kg)"
                  onSubmitEditing={handleSubmit}
                />
              ) : type === "Height" ? (
                <CustomInput
                  value={values["height"]}
                  error={errors["height"]}
                  touched={touched["height"]}
                  onChange={handleChange("height")}
                  onBlur={() => handleBlur("height")}
                  setFieldTouched={() => setFieldTouched("height")}
                  placeholder="Eg. 2"
                  title="Height (cm)"
                  onSubmitEditing={handleSubmit}
                />
              ) : (
                <CustomInput
                  value={values["head"]}
                  error={errors["head"]}
                  touched={touched["head"]}
                  onChange={handleChange("head")}
                  onBlur={() => handleBlur("head")}
                  setFieldTouched={() => setFieldTouched("head")}
                  placeholder="Eg. 2"
                  title="Head Circle (cm)"
                  onSubmitEditing={handleSubmit}
                />
              )}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={{ flex: 1, marginRight: 16 }}
                  onPress={handleClose}
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
                <TouchableOpacity style={{ flex: 1 }} onPress={handleSubmit}>
                  <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalBtn}
                    colors={["#19C190", "#F5B700"]}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {editId ? "Update Details" : "Add Details"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Formik>
  );
}

// const propCheck = (prev, curr) => {
//   return prev.isVisible === curr.isVisible;
// };

// export default React.memo(AddGrowthDetail, propCheck);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(51, 51, 51, 0.4)",
  },
  modalView: {
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
  modalFooter: {
    flexDirection: "row",
    marginTop: 30,
    // height: 50
  },
  modalBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
});

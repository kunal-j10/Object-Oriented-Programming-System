import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
import CheckBox from "@react-native-community/checkbox";
import { Formik } from "formik";
import * as Yup from "yup";

import LoaderPost from "../../components/loader/LoaderPost";
import Colors from "../../../constants/Colors";
import CustomInput from "../../components/auth/CustomInput";
import childImage from "../../../assets/images/child.png";
import DateInput from "../../components/auth/DateInput";
import RadioBtn from "../../components/auth/RadioBtn";
import {
  authErrorSelector,
  authLoadingSelector,
} from "../../../store/auth/selector";
import { addChild, skipChild } from "../../../store/auth/operation";

const validationSchema = Yup.object().shape({
  relation: Yup.string()
    .required("Please select any one from the list")
    .oneOf(
      ["mother", "father", "guardian"],
      "Please select any one from the list"
    ),
  name: Yup.string().trim().required("Please enter your Full Name"),
  dob: Yup.date().required("Please enter your child's birthday"),
  premature: Yup.boolean(),
  originalDob: Yup.date().when("premature", {
    is: true,
    then: Yup.date().required("Please enter your child's original birthday"),
  }),
});

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const relationItems = [
  { label: "Mother", value: "mother" },
  { label: "Father", value: "father" },
  { label: "Guardian", value: "guardian" },
];

export default function AddChild({ navigation, route }) {
  const { isAuth, buttonTitle1, buttonTitle2, returnScreen } = route.params;

  const isLoading = useSelector(authLoadingSelector);
  const errorMessage = useSelector(authErrorSelector);

  const [formSubmited, setFormSubmited] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDobVisible, setIsDobVisible] = useState(false);
  const [isPrematureDobVisible, setIsPrematureDobVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (formSubmited && !isLoading && errorMessage === "") {
      if (typeof returnScreen === "string" && returnScreen !== "") {
        navigation.navigate(returnScreen);
      } else {
        navigation.replace("DrawerNavigator");
      }
    }
  }, [isLoading, formSubmited, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      setFormSubmited(false);
    }
  }, [errorMessage]);

  const childHandler = (values) => {
    const castedValues = validationSchema.cast(values);
    let { dob, originalDob, premature } = castedValues;

    dob = dob.toISOString().split("T")[0];
    if (premature) {
      originalDob = originalDob.toISOString().split("T")[0];
    }

    dispatch(addChild({ ...castedValues, dob, originalDob }));
    setFormSubmited(true);
  };

  const skipHandler = async () => {
    await dispatch(skipChild());
    if (typeof returnScreen === "string" && returnScreen !== "") {
      navigation.navigate(returnScreen);
    } else {
      navigation.replace("DrawerNavigator");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      <ScrollView>
        <Pressable
          style={styles.pressWrapper}
          onPress={() => setDropdownOpen(false)}
        >
          <Image source={childImage} style={styles.image} />
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              relation: "",
              name: "",
              gender: "boy",
              dob: "",
              premature: false,
              originalDob: new Date(),
            }}
            onSubmit={childHandler}
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
              <>
                <CustomInput
                  value={values["name"]}
                  error={errors["name"]}
                  touched={touched["name"]}
                  onChange={handleChange("name")}
                  onBlur={() => handleBlur("name")}
                  setFieldTouched={() => setFieldTouched("name")}
                  placeholder="Enter Name"
                  title="Child's Name"
                  returnKeyType="next"
                />
                <DateInput
                  name="dob"
                  value={values["dob"]}
                  title="Child's Birthday"
                  error={errors["dob"]}
                  onChange={setFieldValue}
                  setIsModalVisible={setIsDobVisible}
                  isModalVisible={isDobVisible}
                />
                <View style={styles.radioGrp}>
                  <Text style={styles.radioTitle}>Gender</Text>
                  <View style={styles.radioBtns}>
                    <RadioBtn
                      name="boy"
                      onChange={handleChange("gender")}
                      value={values["gender"]}
                    />
                    <RadioBtn
                      name="girl"
                      onChange={handleChange("gender")}
                      value={values["gender"]}
                    />
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>Relation with Child</Text>
                  <DropDownPicker
                    listMode="SCROLLVIEW"
                    placeholder="Select"
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholder}
                    textStyle={styles.dropdownTxt}
                    selectedItemContainerStyle={styles.selectedDropdown}
                    selectedItemLabelStyle={styles.selectedDropdownTxt}
                    showTickIcon={false}
                    open={dropdownOpen}
                    value={values["relation"]}
                    items={relationItems}
                    setOpen={setDropdownOpen}
                    setValue={(callback) =>
                      handleChange("relation")(callback())
                    }
                  />
                  {errors["relation"] && (
                    <Text style={styles.errorText}>{errors["relation"]}</Text>
                  )}
                </View>
                <View style={styles.checkboxContainer}>
                  <Text style={styles.checkboxTitle}>
                    Baby born prematurely
                  </Text>
                  <CheckBox
                    value={values["premature"]}
                    onValueChange={(val) => setFieldValue("premature", val)}
                    tintColors={{ true: "#0ACF83", false: "#0ACF83" }}
                    tintColor="#0ACF83"
                    onFillColor="#0ACF83"
                  />
                </View>
                {values["premature"] && (
                  <DateInput
                    name="originalDob"
                    value={values["originalDob"]}
                    title="Original Due Date"
                    error={errors["originalDob"]}
                    onChange={setFieldValue}
                    setIsModalVisible={setIsPrematureDobVisible}
                    isModalVisible={isPrematureDobVisible}
                  />
                )}
                {!isLoading && (
                  <View style={styles.btnGrp}>
                    {isAuth && (
                      <TouchableOpacity
                        style={styles.flex}
                        onPress={skipHandler}
                      >
                        <View
                          style={[
                            styles.btn,
                            route.params.hasOwnProperty("buttonTitle1")
                              ? styles.cancel
                              : styles.skip,
                          ]}
                        >
                          <Text
                            style={
                              route.params.hasOwnProperty("buttonTitle1")
                                ? styles.cancelTxt
                                : styles.skipTxt
                            }
                          >
                            {route.params.hasOwnProperty("buttonTitle1")
                              ? buttonTitle1
                              : "Skip"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.flex}
                      onPress={handleSubmit}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.btn}
                        colors={["#19C190", "#F5B700"]}
                      >
                        <Text style={styles.btnTxt}>
                          {route.params.hasOwnProperty("buttonTitle2")
                            ? buttonTitle2
                            : "Next"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </Formik>
          {isLoading && (
            <View style={styles.loader}>
              <LoaderPost />
            </View>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pressWrapper: {
    paddingHorizontal: 24,
  },
  image: {
    marginTop: 40,
    marginBottom: 25,
    width: windowWidth * 0.8,
    height: windowHeight * 0.25,
    resizeMode: "contain",
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  headerSubTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 18,
  },
  inputContainer: {
    marginVertical: 7,
  },
  inputTitle: {
    marginBottom: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
  btnGrp: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 50,
  },
  flex: {
    flex: 1,
  },
  btn: {
    width: "95%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
  skip: {
    borderWidth: 1,
    borderColor: "#03B44D",
  },
  cancel: {
    borderWidth: 1,
    borderColor: "red",
  },
  skipTxt: {
    color: "#03B44D",
    fontSize: 16,
  },
  cancelTxt: {
    color: "red",
    fontSize: 16,
  },
  btnTxt: {
    color: "white",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    alignItems: "center",
  },
  dropdown: {
    borderRadius: 30,
    borderColor: "#03B44D",
  },
  placeholder: {
    color: "#b2b2b2",
  },
  dropdownTxt: {
    marginLeft: 10,
    fontSize: 16,
  },
  selectedDropdown: {
    backgroundColor: "#03B44D",
  },
  selectedDropdownTxt: {
    color: "#fff",
  },
  checkboxContainer: {
    marginVertical: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxTitle: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  radioGrp: {
    marginVertical: 7,
  },
  radioTitle: {
    marginBottom: 10,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  radioBtns: {
    flexDirection: "row",
  },
});

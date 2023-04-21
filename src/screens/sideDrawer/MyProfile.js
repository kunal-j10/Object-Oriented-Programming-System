import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
  RefreshControl,
  FlatList,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ParentProfile from "../../components/sideDrawer/ParentProfile";
import ChildProfile from "../../components/sideDrawer/ChildProfile";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import { TextInput } from "react-native-gesture-handler";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import CheckBox from "@react-native-community/checkbox";
import Colors from "../../../constants/Colors";
import Constants from "expo-constants";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { switchChild } from "../../../store/auth/operation";
import RadioButton from "../../components/sideDrawer/RadioButton";
import * as yup from "yup";
import {
  childrenDetailsSelector,
  parentDetailsSelector,
  selectedChildIdSelector,
  parentDetailIsrefreshing,
} from "../../../store/auth/selector";
import { StatusBar } from "expo-status-bar";
import {
  parentEditFetch,
  parentEditPasswordFetch,
  childEditFetch,
  profileSectionFetch,
  removeSuccessMessage,
  removeErrorMessage,
} from "../../../store/myProfile/operation";
import {
  PasswordChangeLoadingSelector,
  FailedPasswordMessageSelector,
  MyProfileSectionSelector,
  EditProfileLoadingSelector,
  successMessageSelector,
  errorMessageSelector,
} from "../../../store/myProfile/selector";
import LoaderPost from "../../components/loader/LoaderPost";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from "moment";
import { parentDetailsFetch } from "../../../store/auth/operation";
import DateInput from "../../components/auth/DateInput";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ParentValidationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().trim().email("Please Enter a valid email"),
  dob: yup.date().required().typeError("Invalid Date"),
});
const ChildValidationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  dob: yup.date().required().typeError("Invalid Date"),
});
const PasswordValidationSchema = yup.object({
  changePassword: yup
    .string()
    .trim()
    .required("Please enter your password")
    .matches(
      /^.*(?=.{4,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){0})(?=.*\d)((?=.*[a-z]){0})((?=.*[A-Z]){0}).*$/,
      "Password must contain at least 4 characters"
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required("Please confirm your password")
    .when("changePassword", {
      is: (changePassword) =>
        changePassword && changePassword.length > 0 ? true : false,
      then: yup
        .string()
        .oneOf([yup.ref("changePassword")], "Password doesn't match"),
    }),
});
const MyProfile = (props) => {
  const insets = useSafeAreaInsets();

  const ref = useRef("myLocalFlashMessage");
  const dispatch = useDispatch();
  const [activetext, setactivetext] = useState(false);
  const [password, setpassword] = useState(false);
  const [passwordVisible, setpasswordVisible] = useState(true);
  const isLoadingPassword = useSelector(PasswordChangeLoadingSelector);
  const FailedPasswordText = useSelector(FailedPasswordMessageSelector);
  const childDetails = useSelector(childrenDetailsSelector);
  const selectedchild = useSelector(selectedChildIdSelector);
  const section = useSelector(MyProfileSectionSelector);
  const isRefreshingParentDetail = useSelector(parentDetailIsrefreshing);
  const [activeId, setactiveId] = useState(selectedchild);
  const [edit, setedit] = useState(false);
  const [isDobVisible, setIsDobVisible] = useState(false);

  // Parent profile update selectors
  const parentProfileUpdateLoading = useSelector(EditProfileLoadingSelector);
  const successMessage = useSelector(successMessageSelector);
  const errorMessage = useSelector(errorMessageSelector);

  // const progress = useDrawerProgress();

  // const scale = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [1, 0.8],
  // });

  // const borderRadius = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, 30],
  // });

  // const paddingTop = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [insets.top, 0],
  // });

  // const animatedStyle = {
  //   flex: 1,
  //   borderRadius,
  //   transform: [{ scale }],
  //   overflow: "hidden",
  //   backgroundColor: "#fff",
  //   paddingTop,
  // };


  // Show success message
  useEffect(() => {
    if (successMessage) {
      showMessage({
        message: successMessage,
        position: "bottom",
        duration: 2000,
        type: "success",
        backgroundColor: "#03B44D", // background color
        titleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          alignSelf: "center",
        },
      });
      dispatch(removeSuccessMessage());
    }
  }, [successMessage]);


  // Show error message
  useEffect(() => {
    if (errorMessage) {
      showMessage({
        message: errorMessage,
        position: "bottom",
        duration: 2000,
        type: "failure",
        backgroundColor: "#de291f", // background color
        titleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          alignSelf: "center",
        },
      });

      dispatch(removeErrorMessage());
    }
  }, [errorMessage]);




  const submitHandler = (values) => {
    const castedValues = ParentValidationSchema.cast(values);

    dispatch(
      parentEditFetch({
        name: castedValues.name,
        dob: moment(castedValues.dob).format("YYYY-M-D"),
        email: castedValues.email,
        gender: ischecked,
      })
    );
    dispatch(parentDetailsFetch({ status: "loading" }));

    setactivetext(!activetext);
  };
  const childsubmitHandler = (values) => {
    const castedValues = ChildValidationSchema.cast(values);

    dispatch(
      childEditFetch({
        name: castedValues.name,
        dob: moment(castedValues.dob).format("YYYY-M-D"),
        id: castedValues.id,
        gender: castedValues.gender,
      })
    );
    dispatch(parentDetailsFetch({ status: "loading" }));
    // showMessage({
    //   message: "Saved Changes",
    //   duration: 2000,
    //   position: "bottom",
    //   type: "success",
    //   backgroundColor: "#03B44D", // background color
    //   titleStyle: {
    //     color: "white",
    //     fontWeight: "bold",
    //     fontSize: 16,
    //     alignSelf: "center",
    //   },
    // });

    setedit(false);
  };
  const ispasswordfail = () => {
    if (!isLoadingPassword) {
      return showMessage({
        message: "Password Changed Successfully!",
        duration: 2000,
        position: "bottom",
        type: "success",
        backgroundColor: "#03B44D", // background color
        titleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          alignSelf: "center",
        },
      });
    } else {
      return showMessage({
        message: "Password Changed Successfully!",
        duration: 2000,
        position: "bottom",
        type: "success",
        backgroundColor: "red", // background color
        titleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          alignSelf: "center",
        },
      });
    }
  };

  const PasswordSubmitHandler = (values) => {
    const castedValues = PasswordValidationSchema.cast(values);

    dispatch(parentEditPasswordFetch(castedValues));
    ispasswordfail();
  };
  const parentDetails = useSelector(parentDetailsSelector);

  const [ischecked, setischecked] = useState(parentDetails.gender);
  let childContent;

  if (childDetails.length != 0) {
    childContent = (
      <View style={styles.childsection}>
        {childDetails.map((item) => (
          <View key={item._id}>
            <Formik
              initialValues={{
                name: item.name,
                dob: moment(item.dob, ["MM-DD-YYYY", "YYYY-MM-DD"]),
                gender: item.gender,
                id: item._id,
              }}
              onSubmit={childsubmitHandler}
              validationSchema={ChildValidationSchema}
            >
              {(props) => (
                <ChildProfile
                  setDate={props.setFieldValue}
                  setgender={props.setFieldValue}
                  onChangeName={props.handleChange("name")}
                  onChangedob={props.handleChange("dob")}
                  onpressRadio={() => {
                    dispatch(switchChild(item._id));
                  }}
                  iseditopen={edit}
                  ontoggleedit={() => setedit(!edit)}
                  inputname={props.values.name}
                  inputdob={new Date(props.values.dob)}
                  inputgender={props.values.gender}
                  childId={item._id}
                  activeId={selectedchild}
                  childName={item.name}
                  childbio={item.displayage}
                  handleSubmit={props.handleSubmit}
                  nameError={props.touched.name && props.errors.name}
                  dobError={props.touched.dob && props.errors.dob}
                  onDobBlur={props.handleBlur("dob")}
                  onNameBlur={props.handleBlur("name")}
                  isProfilepic={
                    item.hasOwnProperty("profileImageUrl") ? true : false
                  }
                  color={item?.color}
                  nameinitials={item?.nameinitials}
                  profileurl={item.profileImageUrl}
                />
              )}
            </Formik>
          </View>
        ))}
      </View>
    );
  } else {
    childContent = (
      <View
        style={[
          styles.childsection,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View style={styles.floatingStartBtn}>
          <TouchableNativeFeedback
            onPress={() => {
              props.navigation.navigate("AddChild", {
                isAuth: true,
                buttonTitle1: "Cancel",
                buttonTitle2: "Add",
                returnScreen: "MyProfile",
              });
            }}
          >
            <View style={styles.floatingview}>
              <Feather name="user-plus" size={26} color="#4C4C4C" />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text style={{ color: "#B2B2B2", fontSize: 14, marginTop: 10 }}>
          Register New Child
        </Text>
      </View>
    );
  }
  return (
    // <Animated.View style={animatedStyle}>
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingParentDetail}
          onRefresh={() => {
            dispatch(parentDetailsFetch({ status: "refreshing" }));
          }}
        />
      }
      nestedScrollEnabled
      style={styles.container}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          overflow: "hidden",
          marginTop: Constants.statusBarHeight,
          marginBottom: 20,
        }}
      >
        {/* <StatusBar style="auto" backgroundColor="#03B44D" /> */}
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={24}
            onPress={() => props.navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }}>
          {/* parent card */}
          <View
            style={{
              width: "100%",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <ParentProfile
              isprofile={
                parentDetails.hasOwnProperty("profileImageUrl") ? true : false
              }
              imageurl={parentDetails.profileImageUrl}
              parentName={parentDetails.name}
              parentBio={""}
              color={parentDetails.color}
              nameinitials={parentDetails.nameinitials}
            />
          </View>
          {/* parent card */}

          {/* category */}
          <View style={styles.category}>
            <View style={styles.categoryTitle}>
              <TouchableOpacity
                style={{
                  borderBottomColor:
                    section == "my_profile"
                      ? "black"
                      : "rgba(196, 196, 196, 0.4);",
                  borderBottomWidth: 2,
                }}
                onPress={() => {
                  dispatch(profileSectionFetch({ section: "my_profile" }));
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        section === "my_profile"
                          ? "black"
                          : "rgba(22, 43, 66, 0.6);",
                      marginBottom: 10,
                    },
                  ]}
                >
                  My Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryTitle}>
              <TouchableOpacity
                style={{
                  borderBottomColor:
                    section == "child_profile"
                      ? "black"
                      : "rgba(196, 196, 196, 0.4);",
                  borderBottomWidth: 2,
                }}
                onPress={() => {
                  dispatch(profileSectionFetch({ section: "child_profile" }));
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        section === "child_profile"
                          ? "black"
                          : "rgba(22, 43, 66, 0.6);",
                      marginBottom: 10,
                    },
                  ]}
                >
                  Child Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <ScrollView style = {{flex: 1}}> */}
          {section === "my_profile" ? (
            <View style={styles.editsection}>
              <Formik
                validationSchema={ParentValidationSchema}
                initialValues={{
                  name: parentDetails.name,
                  email: parentDetails.email,
                  dob: parentDetails.hasOwnProperty("dob")
                    ? moment(parentDetails.dob, ["MM-DD-YYYY", "YYYY-MM-DD"])
                    : "",
                  gender: parentDetails.gender,
                  password: "",
                  changePassword: "",
                  confirmPassword: "",
                }}
                onSubmit={submitHandler}
              >
                {(props) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.text}>Full Name</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setactivetext(!activetext);
                        }}
                      >
                        {activetext ? (
                          <MaterialIcons
                            style={{ marginRight: 10 }}
                            name="edit-off"
                            size={22}
                            color="#03B44D"
                          />
                        ) : (
                          <MaterialIcons
                            style={{ marginRight: 10 }}
                            name="edit"
                            size={22}
                            color="#03B44D"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <TextInput
                        onBlur={props.handleBlur("name")}
                        editable={activetext}
                        onChangeText={props.handleChange("name")}
                        placeholder="Enter Your Name"
                        value={props.values.name}
                        style={[
                          styles.textinput,
                          {
                            color: activetext ? "black" : "#8E8E8E",
                            fontWeight: "bold",
                          },
                          {
                            borderColor:
                              props.touched.name && props.errors.name
                                ? "red"
                                : "#03B44D",
                          },
                        ]}
                      />

                      <Text style={styles.error}>
                        {props.touched.name && props.errors.name}
                      </Text>
                    </View>
                    <Text style={styles.text}>Email</Text>
                    <View style={{ marginTop: 5 }}>
                      <TextInput
                        onBlur={props.handleBlur("email")}
                        editable={activetext}
                        onChangeText={props.handleChange("email")}
                        placeholder="Enter your email"
                        value={props.values.email}
                        style={[
                          styles.textinput,
                          {
                            color: activetext ? "black" : "#8E8E8E",
                            fontWeight: "bold",
                          },
                          {
                            borderColor:
                              props.touched.email && props.errors.email
                                ? "red"
                                : "#03B44D",
                          },
                        ]}
                      />
                      <Text style={styles.error}>
                        {props.touched.email && props.errors.email}
                      </Text>
                    </View>

                    <DateInput
                      textinputstyle={styles.textinput}
                      textstyle={styles.text}
                      name="dob"
                      value={
                        props.values.dob == ""
                          ? new Date()
                          : new Date(props.values.dob)
                      }
                      title="Date of Birth"
                      error={props.touched.dob && props.errors.dob}
                      onChange={props.setFieldValue}
                      setIsModalVisible={
                        activetext ? setIsDobVisible : () => {}
                      }
                      isModalVisible={isDobVisible}
                    />

                    <Text style={styles.error}>{props.dobError}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={
                            activetext
                              ? () => setTimeout(() => setischecked("male"), 0)
                              : () => {}
                          }
                        >
                          <RadioButton
                            selected={ischecked === "male" ? true : false}
                            active={!activetext}
                          />
                        </TouchableOpacity>

                        <Text
                          style={{
                            color: "rgba(24, 20, 31, 0.6)",
                            fontSize: 18,
                            marginLeft: 10,
                          }}
                        >
                          Male
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 20,
                        }}
                      >
                        <TouchableOpacity
                          onPress={
                            activetext
                              ? () =>
                                  setTimeout(() => setischecked("female"), 0)
                              : () => {}
                          }
                        >
                          <RadioButton
                            selected={ischecked === "female" ? true : false}
                            active={!activetext}
                          />
                        </TouchableOpacity>

                        <Text
                          style={{
                            color: "rgba(24, 20, 31, 0.6)",
                            fontSize: 18,
                            marginLeft: 10,
                          }}
                        >
                          Female
                        </Text>
                      </View>
                    </View>

                    {activetext ? (
                      <Button
                        style={{ marginTop: 10 }}
                        title="Save"
                        onPress={props.handleSubmit}
                      />
                    ) : null}
                  </View>
                )}
              </Formik>

              <View style={styles.password}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#03B44D",
                      fontWeight: "bold",
                    }}
                  >
                    Password
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setpassword(!password);
                    }}
                  >
                    {password ? (
                      <MaterialIcons
                        style={{ marginRight: 10 }}
                        name="edit-off"
                        size={22}
                        color="#03B44D"
                      />
                    ) : (
                      <MaterialIcons
                        style={{ marginRight: 10 }}
                        name="edit"
                        size={22}
                        color="#03B44D"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <Formik
                  initialValues={{
                    password: "",
                    changePassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={PasswordValidationSchema}
                  onSubmit={PasswordSubmitHandler}
                >
                  {password
                    ? (props) => (
                        <View>
                          <Text style={[styles.text, { marginTop: 20 }]}>
                            Current Password
                          </Text>
                          <View style={styles.custominput}>
                            <TextInput
                              secureTextEntry={passwordVisible}
                              onChangeText={props.handleChange("password")}
                              placeholder="Enter your password"
                              value={props.values.password}
                              style={styles.customtextinput}
                            />
                            <TouchableButton
                              onPress={() =>
                                setpasswordVisible(!passwordVisible)
                              }
                            >
                              <Feather
                                style={styles.trailing}
                                name={!passwordVisible ? "eye" : "eye-off"}
                                size={24}
                                color={Colors.textSecondary}
                              />
                            </TouchableButton>
                          </View>
                          <Text style={styles.text}>Change Password</Text>
                          <View
                            style={[
                              styles.custominput,
                              {
                                borderColor:
                                  props.touched.changePassword &&
                                  props.errors.changePassword
                                    ? "red"
                                    : "#03B44D",
                              },
                            ]}
                          >
                            <TextInput
                              onBlur={props.handleBlur("changePassword")}
                              secureTextEntry={passwordVisible}
                              onChangeText={props.handleChange(
                                "changePassword"
                              )}
                              placeholder="Change your password"
                              value={props.values.changePassword}
                              style={styles.customtextinput}
                            />
                            <TouchableButton
                              onPress={() =>
                                setpasswordVisible(!passwordVisible)
                              }
                            >
                              <Feather
                                style={styles.trailing}
                                name={!passwordVisible ? "eye" : "eye-off"}
                                size={24}
                                color={Colors.textSecondary}
                              />
                            </TouchableButton>
                          </View>
                          <Text style={styles.error}>
                            {props.touched.changePassword &&
                              props.errors.changePassword}
                          </Text>
                          <Text style={styles.text}>Confirm Password</Text>
                          <View
                            style={[
                              styles.custominput,
                              {
                                borderColor:
                                  props.touched.confirmPassword &&
                                  props.errors.confirmPassword
                                    ? "red"
                                    : "#03B44D",
                              },
                            ]}
                          >
                            <TextInput
                              onBlur={props.handleBlur("confirmPassword")}
                              secureTextEntry={passwordVisible}
                              onChangeText={props.handleChange(
                                "confirmPassword"
                              )}
                              placeholder="Confirm your password"
                              value={props.values.confirmPassword}
                              style={styles.customtextinput}
                            />
                            <TouchableButton
                              onPress={() =>
                                setpasswordVisible(!passwordVisible)
                              }
                            >
                              <Feather
                                style={styles.trailing}
                                name={!passwordVisible ? "eye" : "eye-off"}
                                size={24}
                                color={Colors.textSecondary}
                              />
                            </TouchableButton>
                          </View>
                          <Text style={styles.error}>
                            {props.touched.confirmPassword &&
                              props.errors.confirmPassword}
                          </Text>
                          {!isLoadingPassword ? (
                            <Button
                              style={{ marginTop: 10 }}
                              title="Change Password"
                              onPress={props.handleSubmit}
                            />
                          ) : (
                            <View>
                              <Button
                                style={{ marginTop: 10 }}
                                title="Change Password"
                                onPress={props.handleSubmit}
                              />
                              <Text
                                style={{
                                  color: "red",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                }}
                              >
                                Your Current Password is Wrong please try again!
                              </Text>
                            </View>
                          )}
                          <Text style={{ color: "red" }}>
                            {FailedPasswordText}
                          </Text>
                        </View>
                      )
                    : null}
                </Formik>
              </View>
            </View>
          ) : (
            <View>{childContent}</View>
          )}
        </ScrollView>
        {section == "child_profile" && childDetails.length != 0 ? (
          <View style={styles.floatingButton}>
            <TouchableNativeFeedback
              onPress={() => {
                props.navigation.navigate("AddChild", {
                  isAuth: true,
                  buttonTitle1: "Cancel",
                  buttonTitle2: "Add",
                  returnScreen: "MyProfile",
                });
              }}
            >
              <View style={styles.floatingview}>
                <Feather name="user-plus" size={26} color="#4C4C4C" />
              </View>
            </TouchableNativeFeedback>
          </View>
        ) : null}
        <FlashMessage ref={ref} />
      </View>

      <Spinner
        visible={parentProfileUpdateLoading}
        textContent={"Updating"}
        textStyle={{ color: "#FFF" }}
      />
    </ScrollView>
    // </Animated.View>
  );
};

export const MyProfileOptions = ({ navigation }) => {
  return {
    headerTitle: "Profile",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FA",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    textAlign: "center",
  },
  floatingStartBtn: {
    overflow: "hidden",
    borderRadius: 32,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 10,
  },
  floatingButton: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
    right: "5%",
    bottom: "10%",
    borderRadius: 32,
    position: "absolute",
  },
  floatingview: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FAFAFA",
  },
  loader: {
    flex: 1,
    alignItems: "center",
  },
  error: {
    fontSize: 13,
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  category: {
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
  },
  categoryTitle: {
    flexBasis: "50%",
  },
  title: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  editsection: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textinput: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    height: 47,
    borderWidth: 1,
    borderColor: "#03B44D",
    borderRadius: 25,
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
  password: {
    marginVertical: 15,
    width: "100%",
    backgroundColor: "#FFFFFF",
    elevation: 5,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  custominput: {
    marginVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#03B44D",
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  customtextinput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  childsection: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 20,
  },
});

export default MyProfile;

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as Yup from "yup";
import Spinner from "react-native-loading-spinner-overlay";
import DefaultButton from "../../components/DefaultButton";
import Colors from "../../../constants/Colors";
import CustomInput from "../../components/auth/CustomInput";
import RadioBtn from "../../components/auth/RadioBtn";
import LoaderPost from "../../components/loader/LoaderPost";
import {
  authErrorSelector,
  authIsSignUpThroughGoogleSelector,
  authLoadingSelector,
  userPhoneSelector,
} from "../../../store/auth/selector";
import {
  signUp,
  authRemoveSignUpGoogleField,
} from "../../../store/auth/operation";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Please enter your Full Name"),
  phoneNumber: Yup.string()
    .trim()
    .required("Please enter your Mobile Number")
    .matches(/^[0-9]{10}$/, "Please provide a valid Mobile Number"),
  email: Yup.string().trim().email("Please provide a valid valid email"),
  password: Yup.string()
    .trim()
    .required("Please enter your Password")
    .min(4, "Password must contain alteast 4 characters"),
  confirmPassword: Yup.string()
    .trim()
    .required("Please enter your Confirm Password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function SignUp({ navigation, route }) {
  const params = route.params;

  const [name, setName] = useState(params?.signUpGoogleName ?? "");
  const [email, setEmail] = useState(params?.signUpGoogleEmail ?? "");
  const isLoading = useSelector(authLoadingSelector);
  const errorMessage = useSelector(authErrorSelector);
  const number = useSelector(userPhoneSelector);
  const isSignUpThroughGoogle = useSelector(authIsSignUpThroughGoogleSelector);

  const [formSubmited, setFormSubmited] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignUpThroughGoogle === true) {
      dispatch(authRemoveSignUpGoogleField());
    }
  }, [isSignUpThroughGoogle]);

  useEffect(() => {
    if (formSubmited && !isLoading && errorMessage === "") {
      navigation.replace("SignUpOtp", { number });
    }
  }, [isLoading, formSubmited, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      setFormSubmited(false);
    }
  }, [errorMessage]);

  const signupHandler = (values) => {
    const castedValues = validationSchema.cast(values);

    dispatch(signUp(castedValues));
    setFormSubmited(true);
  };

  const focusPass = () => {
    passRef.current.focus();
  };

  const focusConfirmPass = () => {
    confirmPassRef.current.focus();
  };

  const focusEmail = () => {
    emailRef.current.focus();
  };

  const navigateLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="auto" backgroundColor="#03B44D" /> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create an account</Text>
          <Text style={styles.headerSubTitle}>
            Already a member?{" "}
            <Text onPress={navigateLogin} style={styles.navigateLogin}>
              Login
            </Text>
          </Text>
        </View>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name,
            gender: "female",
            phoneNumber: "",
            email,
            password: "",
            confirmPassword: "",
          }}
          onSubmit={signupHandler}
          enableReinitialize
        >
          {({
            handleSubmit,
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldTouched,
          }) => (
            <>
              <CustomInput
                value={values["name"]}
                error={errors["name"]}
                touched={touched["name"]}
                onChange={handleChange("name")}
                onBlur={() => handleBlur("name")}
                setFieldTouched={() => setFieldTouched("name")}
                placeholder="Enter Full Name"
                title="Full Name"
                returnKeyType="next"
              />
              <View style={styles.radioGrp}>
                <Text style={styles.radioTitle}>Gender</Text>
                <View style={styles.radioBtns}>
                  <RadioBtn
                    name="male"
                    onChange={handleChange("gender")}
                    value={values["gender"]}
                  />
                  <RadioBtn
                    name="female"
                    onChange={handleChange("gender")}
                    value={values["gender"]}
                  />
                </View>
              </View>
              <CustomInput
                value={values["phoneNumber"]}
                error={errors["phoneNumber"]}
                touched={touched["phoneNumber"]}
                onChange={handleChange("phoneNumber")}
                onBlur={() => handleBlur("phoneNumber")}
                setFieldTouched={() => setFieldTouched("phoneNumber")}
                placeholder="1234567890"
                title="Mobile Number"
                leadingTitle="phone"
                countryCode="+91"
                returnKeyType="next"
                onSubmitEditing={focusEmail}
              />
              <CustomInput
                ref={emailRef}
                value={values["email"]}
                error={errors["email"]}
                touched={touched["email"]}
                onChange={handleChange("email")}
                onBlur={() => handleBlur("email")}
                setFieldTouched={() => setFieldTouched("email")}
                placeholder="example@gmail.com"
                title="Email"
                optional
                leadingTitle="email"
                returnKeyType="next"
                onSubmitEditing={focusPass}
              />
              <CustomInput
                ref={passRef}
                value={values["password"]}
                error={errors["password"]}
                touched={touched["password"]}
                onChange={handleChange("password")}
                onBlur={() => handleBlur("password")}
                setFieldTouched={() => setFieldTouched("password")}
                placeholder="Enter password"
                title="Password"
                secureTextEntry
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
                returnKeyType="next"
                onSubmitEditing={focusConfirmPass}
              />
              <CustomInput
                ref={confirmPassRef}
                value={values["confirmPassword"]}
                error={errors["confirmPassword"]}
                touched={touched["confirmPassword"]}
                onChange={handleChange("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                setFieldTouched={() => setFieldTouched("confirmPassword")}
                placeholder="Enter Confirm Password"
                title="Confirm Password"
                secureTextEntry
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
                onSubmitEditing={handleSubmit}
              />
              {!isLoading ? (
                <DefaultButton
                  onPress={handleSubmit}
                  type="small"
                  isFullWidth={true}
                  text="Next"
                />
              ):(
                <View style={styles.loader}>
                  <LoaderPost />
                </View>
              )}
            </>
          )}
        </Formik>
      </ScrollView>

      {/* <Spinner
        visible={isLoading}
        textContent={"Submitting"}
        textStyle={{ color: "#FFF" }}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 32,
    marginBottom: 25,
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
  navigateLogin: {
    color: Colors.brandPrimary.default,
    fontWeight: "bold",
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
  btn: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    marginTop: 20,
    marginBottom: 50,
  },
  btnTxt: {
    color: "white",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    alignItems: "center",
  }
});

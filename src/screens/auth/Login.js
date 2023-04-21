import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import GoogleLogo from "../../../assets/images/google.png";
import * as Yup from "yup";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import Toast from "react-native-root-toast";
import crashlytics from "@react-native-firebase/crashlytics";
import config from "../../../constants/config.json";
import DefaultFontSizes from "../../../constants/DefaultFontSizes";
import LoaderPost from "../../components/loader/LoaderPost";
import { login, authSignInGoogle } from "../../../store/auth/operation";
import {
  authIsSignUpThroughGoogleSelector,
  authLoadingSelector,
  authSignUpGoogleEmailSelector,
  authSignUpGoogleNameSelector,
} from "../../../store/auth/selector";
import CustomInput from "../../components/auth/CustomInput";
import Colors from "../../../constants/Colors";
import DefaultButton from "../../components/DefaultButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const validationSchema = Yup.object().shape({
  emailPhone: Yup.string()
    .trim()
    .required("Please enter your email or phone Number")
    .matches(
      /(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$)|(^[0-9]{10}$)/,
      "Please provide a valid email or phone number"
    ),
  password: Yup.string()
    .trim()
    .required("Please enter your Password")
    .min(4, "Password must contain alteast 4 characters"),
});

GoogleSignin.configure({
  webClientId: config.webClientId,
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isLoading = useSelector(authLoadingSelector);
  const isSignUpThroughGoogle = useSelector(authIsSignUpThroughGoogleSelector);
  const signUpGoogleName = useSelector(authSignUpGoogleNameSelector);
  const signUpGoogleEmail = useSelector(authSignUpGoogleEmailSelector);
  const [disabled, setdisabled] = useState(true);
  const usernameRef = useRef(null);
  const passRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignUpThroughGoogle === true) {
      navigation.replace("SignUp", {
        signUpGoogleEmail,
        signUpGoogleName,
      });
    }
  }, [isSignUpThroughGoogle, signUpGoogleEmail, signUpGoogleName]);

  const loginhandler = (values) => {
    const { emailPhone: username, password } = validationSchema.cast(values);
    dispatch(login({ username, password }));
    // dispatch(parentDetailsFetch());
  };

  const forgetPassHandler = () => {
    navigation.navigate("ForgetPass");
  };

  const loginOtpHandler = () => {
    navigation.navigate("LoginOtp");
  };

  const focusPass = () => {
    passRef.current.focus();
  };

  const navigateSignup = () => {
    navigation.replace("SignUp");
  };

  const onGoogleSignInHandler = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      dispatch(
        authSignInGoogle({ token: userInfo.idToken, user: userInfo.user })
      );

      await GoogleSignin.revokeAccess();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        Toast.show("IN_PROGRESS: ", {
          duration: Toast.durations.SHORT,
          shadow: true,
          animation: true,
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        crashlytics().recordError(error);
      } else {
        // some other error happened
        crashlytics().recordError(error);
        Toast.show(error.message, {
          duration: Toast.durations.SHORT,
          shadow: true,
          animation: true,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="auto"  /> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Welcome{" "}
            <Text style={{ color: Colors.brandSecondary.dark }}>Back</Text>
          </Text>
          <Text style={styles.headerSubTitle}>
            Log into your account by entering your username (registered email
            address/mobile number) and password
          </Text>
        </View>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ emailPhone: "", password: "" }}
          onSubmit={loginhandler}
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
                ref={usernameRef}
                value={values["emailPhone"]}
                error={errors["emailPhone"]}
                touched={touched["emailPhone"]}
                onChange={handleChange("emailPhone")}
                onBlur={() => handleBlur("emailPhone")}
                setFieldTouched={() => setFieldTouched("emailPhone")}
                placeholder="Enter email or phone number"
                leadingTitle="emailPhone"
                countryCode="+91"
                onCodePress={() => {}}
                returnKeyType="next"
                onSubmitEditing={focusPass}
              />
              <CustomInput
                ref={passRef}
                value={values["password"]}
                error={errors["password"]}
                touched={touched["password"]}
                onChange={handleChange("password")}
                onBlur={() => {
                  if (
                    (errors.emailPhone &&
                    values.emailPhone != "") &&
                   ( errors.password &&
                    values.password != "")
                  ) {
                    setdisabled(false);
                  } else {
                    setdisabled(true);
                  }
                  handleBlur("password");
                }}
                setFieldTouched={() => {
                  setFieldTouched("password");
                }}
                placeholder="Enter password"
                secureTextEntry
                passwordVisible={passwordVisible}
                setPasswordVisible={setPasswordVisible}
                onSubmitEditing={handleSubmit}
              />
              <Text onPress={forgetPassHandler} style={styles.forgetPass}>
                Forgot Password
              </Text>
              {!isLoading && (
                <DefaultButton
                  // isDisabled={disabled}
                  onPress={handleSubmit}
                  isFullWidth={true}
                  type="small"
                  text="Continue"
                />
              )}
            </>
          )}
        </Formik>
        {!isLoading ? (
          <>
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <DefaultButton
              onPress={onGoogleSignInHandler}
              isFullWidth={true}
              type="small"
              outline
              text="Login with Google"
              secondaryOutline={true}
              textStyle={{ color: Colors.brandPrimary.default }}
              leadingIcon={() => {
                return (
                  <Image
                    source={GoogleLogo}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                );
              }}
            />

            <DefaultButton
              onPress={loginOtpHandler}
              isFullWidth={true}
              type="small"
              outline
              text="Login with OTP"
              secondaryOutline={true}
              textStyle={{ color: Colors.brandPrimary.default }}
              containerStyle={{ marginVertical: 0 }}
              leadingIcon={() => {
                return (
                  <MaterialCommunityIcons
                    name="cellphone"
                    style={{ marginRight: 10 }}
                    color={Colors.brandSecondary.dark}
                    size={22}
                  />
                );
              }}
            />
            {/* <View style={styles.signupContainer}>
              <Text style={styles.signupTxt}>Don’t have a account?</Text>
              <Text onPress={navigateSignup} style={styles.signup}>
                Signup
              </Text>
            </View> */}
          </>
        ) : (
          <View style={styles.loader}>
            <LoaderPost />
          </View>
        )}
      </ScrollView>
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
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.brandPrimary.default,
    fontWeight: "bold",
    fontSize: DefaultFontSizes.h4.fontSize,
  },
  headerSubTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 18,
    textAlign: "center",
  },
  btn: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    marginTop: 20,
  },
  btnTxt: {
    color: "white",
    fontSize: 16,
  },
  forgetPass: {
    alignSelf: "flex-end",
    color: Colors.brandPrimary.default,
    fontSize: 12,
    textDecorationLine: "underline",
    marginTop: 5,
  },
  orContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  orLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
  },
  or: {
    color: Colors.textSecondary,
    marginHorizontal: 22,
  },
  loginOtp: {
    backgroundColor: "#19C190",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    color: Colors.brandPrimary.default,
  },
  signupContainer: {
    alignSelf: "center",
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  signupTxt: {
    fontSize: 12,
    color: "#000",
    marginRight: 8,
  },
  signup: {
    color: "#03B44D",
    fontSize: 14,
  },
});

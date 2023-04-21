import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TextInput, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import GoogleLogo from "../../../assets/images/google.png";
import * as Yup from "yup";
import crashlytics from "@react-native-firebase/crashlytics";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import DefaultFontSizes from "../../../constants/DefaultFontSizes";
import DefaultButton from "../../components/DefaultButton";
import Colors from "../../../constants/Colors";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import LoaderPost from "../../components/loader/LoaderPost";
import { LeadingText } from "../../components/auth/CustomInput";
import {
  authLoadingSelector,
  otpGeneratedSelector,
} from "../../../store/auth/selector";
import { loginOtp, sendOtp ,authSignInGoogle} from "../../../store/auth/operation";
import { Keyboard } from "react-native-web";
const phonePattern = /^[0-9]{10}$/;
const otpPattern = /^[0-9]{4}$/;

export default function LoginOtp({ navigation }) {
  const isLoading = useSelector(authLoadingSelector);
  const otpGenerated = useSelector(otpGeneratedSelector);

  const [isOtpSend, setIsOtpSend] = useState(false);

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const phoneRef = useRef(null);

  const [otp, setOtp] = useState("");
  const [resendTime, setResendTime] = useState(30);
  const otpRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (otpGenerated === "generated") {
      setIsOtpSend(true);
      setOtp("");
    } else if (otpGenerated === "failed") {
      phoneRef.current.focus();
    }
  }, [otpGenerated]);

  useEffect(() => {
    if (isFirstTime && phone.length > 0) {
      setIsFirstTime(false);
    } else if (!isFirstTime) {
      setPhoneError(!phonePattern.test(phone));
    }
  }, [phone]);

  useEffect(() => {
    if (!isOtpSend) {
      phoneRef.current.focus();
    } else {
      focusOtp();
    }
  }, [isOtpSend]);

  useEffect(() => {
    if (otp.length == 4) {
      otpRef.current.blur();
      loginHandler();
    }
  }, [otp]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendTime <= 0) {
        clearInterval(timer);
      } else {
        setResendTime(resendTime - 1);
      }
    }, 1000);

    if (!isOtpSend) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isOtpSend, resendTime]);

  const sendOtpHandler = () => {
    if (isFirstTime || phoneError) {
      phoneRef.current.focus();
    } else {
      dispatch(sendOtp(phone));
      phoneRef.current.blur();
    }
  };

  const loginHandler = () => {
    if (!otpPattern.test(otp)) {
      focusOtp();
    } else {
      dispatch(loginOtp({ phone, otp }));
    }
  };

  const resendHandler = () => {
    dispatch(sendOtp(phone));
    focusOtp();
    setOtp("");
    setResendTime(30);
  };

  const focusOtp = () => {
    otpRef.current.blur();

    setTimeout(() => otpRef.current.focus(), 100);
  };

  const changeOtp = (text) => {
    setOtp(text);
  };

  const editPhone = () => {
    setIsOtpSend(false);
  };

  const onGoogleSignInHandler = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      // console.log({ userInfo, isPlayServiceAva });
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
    <View style={styles.container}>
      {/* <StatusBar style="auto" backgroundColor="#03B44D"/> */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome{" "}
          <Text style={{ color: Colors.brandSecondary.dark }}>Back</Text>
        </Text>
        <Text style={styles.headerSubTitle}>
          Log into your account by entering your mobile number to receive a One
          Time Password (OTP) for verification
        </Text>
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>Mobile Number</Text>
        <View
          style={[
            styles.inputContainer,
            isOtpSend && { backgroundColor: "#E9ECEF" },
            phoneError && styles.errorInput,
          ]}
        >
          <LeadingText text="+91" />
          <TextInput
            ref={phoneRef}
            style={styles.textInput}
            value={phone}
            onChangeText={(text) => setPhone(text)}
            editable={!isOtpSend}
            placeholder="1234567890"
            keyboardType="number-pad"
            onSubmitEditing={sendOtpHandler}
            maxLength={10}
          />
          {isOtpSend && (
            <TouchableButton onPress={editPhone}>
              <MaterialIcons
                style={styles.trailing}
                name="edit"
                size={24}
                color={Colors.textSecondary}
              />
            </TouchableButton>
          )}
        </View>
      </View>

      {isOtpSend && (
        <View style={styles.inputBox}>
          <Text style={styles.inputTitle}>
            Input your OTP code sent via SMS
          </Text>

          <View style={styles.input}>
            <TextInput
              ref={otpRef}
              style={styles.otpInput}
              value={otp}
              onChangeText={changeOtp}
              maxLength={4}
              keyboardType="number-pad"
            />
            {Array(4)
              .fill()
              .map((_, i) => (
                <TouchableWithoutFeedback key={i} onPress={focusOtp}>
                  <View
                    style={[
                      styles.otpBox,
                      i === otp.length && styles.selectedInput,
                    ]}
                  >
                    <Text style={styles.otpBoxTxt}>
                      {otp && otp.length > 0 ? otp[i] : ""}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
          </View>
        </View>
      )}
      {!isLoading ? (
        <>
          <DefaultButton
            type="small"
            isFullWidth={true}
            onPress={isOtpSend ? loginHandler : sendOtpHandler}
            text={isOtpSend ? "Verify" : "Continue"}
          />
          {isOtpSend && (
            <View style={styles.resendContainer}>
              <Text style={styles.resendTxt}>
                Didn’t receive the OTP? {resendTime > 0 && " Resend in"}
              </Text>
              {resendTime > 0 ? (
                <Text style={styles.resend}>{resendTime} sec</Text>
              ) : (
                <Text onPress={resendHandler} style={styles.resend}>
                  Resend
                </Text>
              )}
            </View>
          )}
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
            onPress={() => navigation.navigate("Login")}
            isFullWidth={true}
            type="small"
            outline
            text="Login with Username"
            secondaryOutline={true}
            textStyle={{ color: Colors.brandPrimary.default }}
            containerStyle={{ marginVertical: 0 }}
            leadingIcon={() => {
              return (
                <FontAwesome
                  name="user-circle-o"
                  style={{ marginRight: 10 }}
                  color={Colors.brandSecondary.dark}
                  size={22}
                />
              );
            }}
          />
        </>
      ) : (
        <View style={styles.loader}>
          <LoaderPost />
        </View>
      )}

      <Spinner
        visible={otpGenerated === "loading"}
        textContent={"Loading"}
        textStyle={{ color: "#FFF" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  inputBox: {
    marginVertical: 8,
  },
  inputTitle: {
    marginBottom: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  otpInput: {
    width: 1,
    height: 1,
  },
  otpBox: {
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  otpBoxTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedInput: {
    borderColor: Colors.brandPrimary.default,
    borderWidth: 2,
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
  resendContainer: {
    marginTop: 16,
    flexDirection: "row",
  },
  resendTxt: {
    fontSize: 12,
    color: "#000",
    marginRight: 8,
  },
  resend: {
    color: Colors.brandPrimary.default,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingRight: 20,
    paddingLeft: 8,
  },
  trailing: {
    paddingHorizontal: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  loader: {
    flex: 1,
    alignItems: "center",
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
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

// setting header for Login with OTP screen
export const LoginOtpOptions = ({ navigation }) => {
  return {
    headerTitle: "",
    headerStyle: {
      backgroundColor: "white",
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

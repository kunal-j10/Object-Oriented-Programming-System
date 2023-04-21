import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import { MaterialIcons } from "@expo/vector-icons";
import DefaultButton from "../../components/DefaultButton";
import LoaderPost from "../../components/loader/LoaderPost";
import Colors from "../../../constants/Colors";
import otpScreenImaage from "../../../assets/images/otpsignupimg.png";
import { LeadingText } from "../../components/auth/CustomInput";
import {
  authErrorSelector,
  authLoadingSelector,
  otpGeneratedSelector,
} from "../../../store/auth/selector";
import { sendOtpReg, verifySignUpOtp } from "../../../store/auth/operation";

const phonePattern = /^[0-9]{10}$/;
const otpPattern = /^[0-9]{4}$/;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignUpOtp({ navigation, route }) {
  const { number } = route.params;

  const isLoading = useSelector(authLoadingSelector);
  const otpGenerated = useSelector(otpGeneratedSelector);
  const errorMessage = useSelector(authErrorSelector);

  const [otpSubmited, setOtpSubmited] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [phone, setPhone] = useState(number);
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
    if (otpSubmited && !isLoading && errorMessage === "") {
      navigation.replace("AddChild", { isAuth: true });
    }
  }, [isLoading, otpSubmited, errorMessage]);

  useEffect(() => {
    if (!isFirstTime && !isLoading) {
      setOtpSubmited(false);
    }
  }, [isLoading, isFirstTime]);

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
      continueHandler();
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
      dispatch(sendOtpReg(phone));
      phoneRef.current.blur();
    }
  };

  const continueHandler = () => {
    if (!otpPattern.test(otp)) {
      focusOtp();
    } else {
      dispatch(verifySignUpOtp({ phone, otp }));
      setOtpSubmited(true);
    }
  };

  const resendHandler = () => {
    dispatch(sendOtpReg(phone));
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

  return (
    <SafeAreaView style={styles.container}>
              {/* <StatusBar style="auto" backgroundColor="#03B44D"/> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={otpScreenImaage} style={styles.image} />
          <Text style={styles.headerTitle}>
            <Text style={styles.highlight}>OTP</Text> Verification
          </Text>
          <Text style={styles.headerSubTitle}>
            You will receive a One Time Password{" "}
            <Text style={styles.highlight}>(OTP)</Text> on this mobile number
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
            onPress={isOtpSend ? continueHandler : sendOtpHandler}
            text= {isOtpSend ? "Verify" : "Send OTP"}
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
          </>
        ) : (
          <View style={styles.loader}>
            <LoaderPost />
          </View>
        )}
      </ScrollView>

      <Spinner
        visible={otpGenerated === "loading"}
        textContent={"Loading"}
        textStyle={{ color: "#FFF" }}
      />
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
    marginVertical: 20,
    alignItems: "center",
  },
  image: {
    width: windowWidth * 0.52,
    height: windowHeight * 0.25,
    resizeMode: "contain",
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
    marginTop: 15,
    textAlign: "center",
  },
  highlight: {
    color:Colors.brandPrimary.default,
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
    borderRadius: 20,
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
});

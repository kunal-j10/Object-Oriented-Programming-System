import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Formik } from "formik";
import * as Yup from "yup";
import DefaultButton from "../../components/DefaultButton";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import LoaderPost from "../../components/loader/LoaderPost";
import {
  authErrorSelector,
  authLoadingSelector,
  authSuccessMessageSelector,
} from "../../../store/auth/selector";
import CustomInput from "../../components/auth/CustomInput";
import Colors from "../../../constants/Colors";
import { changePass } from "../../../store/auth/operation";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter your Password")
    .min(4, "Password must contain alteast 4 characters"),
  confirmPassword: Yup.string()
    .required("Please enter your Confirm Password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function Login({ navigation }) {
  const isLoading = useSelector(authLoadingSelector);
  const successMessage = useSelector(authSuccessMessageSelector);
  const errorMessage = useSelector(authErrorSelector);

  const [formSubmited, setFormSubmited] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passRef = useRef(null);
  const confirmPassRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (formSubmited && !isLoading && errorMessage === "") {
      Alert.alert(
        "Password Updated",
        successMessage + "\nNavigate to Login Screen",
        [
          {
            text: "Ok",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    }
  }, [isLoading, formSubmited, successMessage, errorMessage]);

  useEffect(() => {
    if (errorMessage) {
      setFormSubmited(false);
    }
  }, [errorMessage]);

  const resetHandler = ({ password }) => {
    dispatch(changePass(password));
    setFormSubmited(true);
  };

  const focusConfirmPass = () => {
    confirmPassRef.current.focus();
  };

  return (
    <View style={styles.container}>
              {/* <StatusBar style="auto" backgroundColor="#03B44D"/> */}

      <View style={styles.header}>
      <Text style={styles.headerTitle}>
            Reset{" "}
            <Text style={{ color: Colors.brandSecondary.dark }}>Password</Text>
          </Text>
        <Text style={styles.headerSubTitle}>
        Create a new password which must be different from previous used passwords
        </Text>
      </View>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ password: "", confirmPassword: "" }}
        onSubmit={resetHandler}
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
              ref={passRef}
              value={values["password"]}
              error={errors["password"]}
              touched={touched["password"]}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              setFieldTouched={() => setFieldTouched("password")}
              placeholder="New Password"
              secureTextEntry
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              returnKeyType="next"
              onSubmitEditing={focusConfirmPass}
              style = {{marginVertical:10}}
            />
            <CustomInput
              ref={confirmPassRef}
              value={values["confirmPassword"]}
              error={errors["confirmPassword"]}
              touched={touched["confirmPassword"]}
              onChange={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              setFieldTouched={() => setFieldTouched("confirmPassword")}
              placeholder="Confirm Password"
              secureTextEntry
              passwordVisible={passwordVisible}
              setPasswordVisible={setPasswordVisible}
              onSubmitEditing={handleSubmit}
              style = {{marginVertical:10}}
            />
            {!isLoading && (
              <DefaultButton
              onPress={handleSubmit}
              type="small"
              isFullWidth={true}
              text="Confirm"
            />
            )}
          </>
        )}
      </Formik>
      {isLoading && (
        <View style={styles.loader}>
          <LoaderPost />
        </View>
      )}
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
    alignItems:"center"
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
    textAlign:"center"
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
    color: "#03B44D",
    fontSize: 12,
    textDecorationLine: "underline",
    marginTop: 5,
  },
  orContainer: {
    flexDirection: "row",
    marginTop: 15,
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
  },
});

// setting header for Change Password screen
export const ChangePassOptions = ({ navigation }) => {
  return {
    headerTitle: "",
    headerStyle: {
      backgroundColor: Colors.white,
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

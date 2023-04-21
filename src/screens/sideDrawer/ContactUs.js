import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import AppBar from "../../components/AppBar";
import Constants from "expo-constants";
import Colors from "../../../constants/Colors";
import Button from "../../components/Button";
import { Formik } from "formik";
import { parentDetailsSelector } from "../../../store/auth/selector";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactUsDetails } from "../../../store/sideDrawer/operation";
import {
  ContactUsResSelector,
  ContactUsResLoadingSelector,
} from "../../../store/sideDrawer/selector";
import LoaderPost from "../../components/loader/LoaderPost";
import Toast from "react-native-root-toast";
import { useEffect } from "react";
import * as yup from "yup";
const HEIGHT = Dimensions.get("window").height;

const ParentValidationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().trim().email("Please Enter a valid email"),
  message: yup
    .string()
    .trim()
    .required()
    .min(10, "Message must be of atleast 10 letters"),
});

const ContactUs = (props) => {
  const parentDetails = useSelector(parentDetailsSelector);

  const initialValues = {
    name: parentDetails.name,
    email: parentDetails?.email,
    message: "",
  };

  const dispatch = useDispatch();

  const response = useSelector(ContactUsResSelector);
  const responseLoading = useSelector(ContactUsResLoadingSelector);
  // console.log(response);

  const SubmitContactUs = (values, { resetForm }) => {
    const castedValues = ParentValidationSchema.cast(values);

    dispatch(
      fetchContactUsDetails({
        fullName: castedValues.name,
        email: castedValues.email,
        message: castedValues.message,
      })
    );
    resetForm({ values: initialValues });
  };

  useEffect(() => {
    if (response !== "") {
      Toast.show(response, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
      });
    }
  }, [response]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <AppBar navigation={props.navigation} title="Contact Us" />
      <View style={styles.content}>
        <Text style={styles.header}>
          We’ve grabbed your name and email from your login, but if prefer, you
          can change
        </Text>
        <Formik
          initialValues={initialValues}
          //   onSubmit={childsubmitHandler}
          validationSchema={ParentValidationSchema}
          onSubmit={SubmitContactUs}
        >
          {(props) => (
            <>
              <View style={styles.view}>
                <Text style={styles.title}>Full Name</Text>
                <TextInput
                  onBlur={props.handleBlur("name")}
                  onChangeText={props.handleChange("name")}
                  value={props.values.name}
                  style={styles.TextInput}
                  placeholder="Enter Your Full Name"
                />
                <Text style={styles.error}>
                  {props.touched.name && props.errors.name}
                </Text>
              </View>

              <View style={styles.view}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  style={styles.TextInput}
                  placeholder="Enter Your Email"
                />
                <Text style={styles.error}>
                  {props.touched.email && props.errors.email}
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={styles.title}>Message</Text>
                <TextInput
                  onBlur={props.handleBlur("message")}
                  onChangeText={props.handleChange("message")}
                  value={props.values.message}
                  style={[styles.TextInput, { textAlignVertical: "top" }]}
                  multiline={true}
                  numberOfLines={HEIGHT > 600 ? 10 : 6}
                  placeholder="Enter Your Message..."
                />
                <Text style={styles.error}>
                  {props.touched.message && props.errors.message}
                </Text>
              </View>
              {responseLoading ? (
                <LoaderPost />
              ) : (
                <Button
                  onPress={props.handleSubmit}
                  style={{ marginTop: 23 }}
                  title="Submit"
                />
              )}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    fontSize: HEIGHT > 600 ? 20 : 15,
    color: Colors.primary,
    fontWeight: "bold",
  },
  TextInput: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: HEIGHT > 600 ? 14 : 10,
    fontSize: HEIGHT > 600 ? 16 : 12,
    marginTop: 12,
  },
  title: {
    fontSize: HEIGHT > 600 ? 18 : 14,
    fontWeight: "bold",
    color: "#000000",
  },
  view: {
    marginTop: 10,
  },
  error: {
    fontSize: 13,
    color: "red",
  },
});

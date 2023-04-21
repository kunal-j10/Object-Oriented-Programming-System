import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import AppBar from "../../components/AppBar";
import Constants from "expo-constants";
import FeedBack from "../../../assets/images/Feedback.png";
import veryBad from "../../../assets/images/veryBad.png";
import veryHappy from "../../../assets/images/veryHappy.png";
import satisfactory from "../../../assets/images/satisfactory.png";
import Happy from "../../../assets/images/Happy.png";
import Bad from "../../../assets/images/Bad.png";
import Colors from "../../../constants/Colors";
import Button from "../../components/Button";
import { Formik } from "formik";
import { fetchFeedbackDetails } from "../../../store/sideDrawer/operation";
import {
  FeedBackResSelector,
  FeedBackResLoadingSelector,
} from "../../../store/sideDrawer/selector";
import * as yup from "yup";
import LoaderPost from "../../components/loader/LoaderPost";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
const HEIGHT = Dimensions.get("window").height;

const FeedbackValidationSchema = yup.object({
  message: yup
    .string()
    .trim()
    .required()
    .min(10, "Message must be of atleast 10 ltters"),
  rating: yup
    .string()
    .trim()
    .required("Select a rating to submit the feedback"),
});

const Feedback = (props) => {
  const response = useSelector(FeedBackResSelector);
  const responseLoading = useSelector(FeedBackResLoadingSelector);

  const initialValues = {
    rating: "",
    message: "",
  };

  const [rating, setrating] = useState("");
  const dispatch = useDispatch();

  const SubmitFeedback = (values, { resetForm }) => {
    const castedValues = FeedbackValidationSchema.cast(values);

    dispatch(
      fetchFeedbackDetails({
        rating: castedValues.rating,
        feedback: castedValues.message,
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
    <View style={styles.container}>
      <AppBar navigation={props.navigation} title="Feedback" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image
            style={{
              width: HEIGHT > 600 ? "85%" : 170,
              height: HEIGHT > 600 ? "25%" : 110,
              resizeMode: "cover",
              alignSelf: "center",
              bottom: -30,
            }}
            source={FeedBack}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={FeedbackValidationSchema}
            onSubmit={SubmitFeedback}
          >
            {(props) => (
              <>
                <View style={styles.card}>
                  <Text style={[styles.header, { color: "black" }]}>
                    Send Your{" "}
                    <Text style={[styles.header, { color: Colors.primary }]}>
                      FeedBack!
                    </Text>
                  </Text>
                  <Text style={styles.suggestion}>
                    We would like your feedback to improve our application
                  </Text>
                  <View style={styles.rating}>
                    <TouchableOpacity
                      onPress={() => {
                        setrating("Very Bad");
                        props.setFieldValue("rating", "Very Bad");
                      }}
                      style={styles.ratingIcon}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: rating == "Very Bad" ? 1 : 0.46,
                        }}
                        source={veryBad}
                      />
                      {rating == "Very Bad" ? (
                        <Text
                          style={{
                            color: "red",
                            fontSize: HEIGHT > 600 ? 9 : 7,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {rating}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setrating("Bad");
                        props.setFieldValue("rating", "Bad");
                      }}
                      style={styles.ratingIcon}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: rating == "Bad" ? 1 : 0.46,
                        }}
                        source={Bad}
                      />
                      {rating == "Bad" ? (
                        <Text
                          style={{
                            color: "#FF7F7F",
                            fontSize: HEIGHT > 600 ? 9 : 7,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {rating}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setrating("Satisfactory");
                        props.setFieldValue("rating", "Satisfactory");
                      }}
                      style={styles.ratingIcon}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: rating == "Satisfactory" ? 1 : 0.46,
                        }}
                        source={satisfactory}
                      />
                      {rating == "Satisfactory" ? (
                        <Text
                          style={{
                            color: "#F5B700",
                            fontSize: HEIGHT > 600 ? 9 : 7,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {rating}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setrating("Happy");
                        props.setFieldValue("rating", "Happy");
                      }}
                      style={styles.ratingIcon}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: rating == "Happy" ? 1 : 0.46,
                        }}
                        source={Happy}
                      />
                      {rating == "Happy" ? (
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: HEIGHT > 600 ? 9 : 7,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {rating}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setrating("Very Happy");
                        props.setFieldValue("rating", "Very Happy");
                      }}
                      style={styles.ratingIcon}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          opacity: rating == "Very Happy" ? 1 : 0.46,
                        }}
                        source={veryHappy}
                      />
                      {rating == "Very Happy" ? (
                        <Text
                          style={{
                            color: "#2EDA75",
                            fontSize: HEIGHT > 600 ? 9 : 7,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {rating}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.error}>
                    {props.touched.rating && props.errors.rating}
                  </Text>
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
                    style={{ marginTop: 32 }}
                    title="Send Feedback"
                  />
                )}
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
  },
  card: {
    paddingHorizontal: 18,
    paddingBottom: HEIGHT > 600 ? 22 : 12,
    paddingVertical: HEIGHT > 600 ? 32 : 12,
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: HEIGHT > 600 ? 20 : 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  suggestion: {
    fontSize: HEIGHT > 600 ? 14 : 11,
    marginVertical: 20,
    textAlign: "center",
  },
  TextInput: {
    width: "100%",
    borderRadius: 10,
    padding: 13,
    fontSize: 12,
    marginTop: 10,
    color: "#868686",
    backgroundColor: "#E3E3E3",
  },
  error: {
    fontSize: 13,
    color: "red",
  },
  rating: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingIcon: {
    height: HEIGHT > 600 ? 50 : 40,
    width: HEIGHT > 600 ? 50 : 40,
  },
});

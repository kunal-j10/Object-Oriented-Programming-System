import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import AppBar from "../../components/AppBar";
import Constants from "expo-constants";
import Colors from "../../../constants/Colors";
import { Linking } from "react-native";
const HEIGHT = Dimensions.get("window").height;

const AboutUs = (props) => {
  return (
    <View style={styles.container}>
      <AppBar navigation={props.navigation} title="About Us" />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.header, { color: Colors.primary }]}>
            Adwaita Educare
          </Text>
          <Text style={styles.Aboutcontent}>Version 1.1.0</Text>
          <Text style={styles.Aboutcontent}>
            Copyright (c) J2 Interactive 2021, 2022, All rights reserved.
          </Text>
        </View>

        <View style={styles.border}></View>

        <View style={styles.section}>
          <Text style={styles.header}>Terms & policies</Text>
          <Text style={styles.Aboutcontent}>
            By using Adwaita Educare app, you agree to Adwaita Educare app’s
            Terms and Policies
          </Text>
        </View>

        <View style={styles.border}></View>

        <View style={styles.section}>
          <Text style={styles.header}>Support</Text>
          <Text style={styles.Aboutcontent}>
            Please leave question, bugs reports, or comments on the forum.
            Alternatively, you can reach us at{" "}
            <Text
              onPress={() =>
                Linking.openURL("https://adwaitaeducare.com/terms")
              }
              style={{ color: "black", fontWeight: "bold" }}
            >
              support@adwaita.in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AboutUs;

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
  },
  section: {
    paddingVertical: HEIGHT > 600 ? 25 : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D6D6D6",
  },
  header: {
    fontSize: HEIGHT > 600 ? 20 : 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  Aboutcontent: {
    fontSize: HEIGHT > 600 ? 13 : 10,
    color: "#505050",
  },
});

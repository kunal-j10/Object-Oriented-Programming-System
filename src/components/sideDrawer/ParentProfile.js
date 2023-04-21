import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import UserAvatar from "../UserAvtar";
import { parentProfilePicFetch } from "../../../store/myProfile/operation";
import crashlytics from "@react-native-firebase/crashlytics";

const ParentProfile = (props) => {
  const dispatch = useDispatch();
  const TakePhotofromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        dispatch(parentProfilePicFetch(image.path));
      })
      .catch((err) => {
        crashlytics().recordError(err);
      });
  };
  return (
    <View style={styles.card}>
      <View style={styles.cardheader}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={TakePhotofromGallery}>
            <View>
              {props.isprofile ? (
                <Image
                  source={{uri:props.imageurl}}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: "#03B44D",
                  }}
                />
              ) : (
                <UserAvatar
                  profileVisibility="public"
                  color={props.color}
                  nameInitial={props.nameinitials}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: "#03B44D",
                  }}
                />
              )}

              <FontAwesome
                color="#03B44D"
                name="camera"
                size={20}
                style={{ position: "absolute", bottom: 0, right: "7%" }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "left",
                color: "black",
              }}
            >
              {props.parentName}
            </Text>
            <Text
              style={{ fontSize: 14, textAlign: "justify", color: "#263238" }}
            >
              {props.parentBio}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 9,
    marginTop: 25,
    marginHorizontal: 20,
    width: "100%",
    height: 112,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  cardheader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default ParentProfile;

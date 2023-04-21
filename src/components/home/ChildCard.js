import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TextInput,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  selectedChildDetailsSelector,
  selectedChildDetailsLaodingSelector,
  authLoadingSelector,
} from "../../../store/auth/selector";
import { useSelector } from "react-redux";
import { profileSectionFetch } from "../../../store/myProfile/operation";
import { useDispatch } from "react-redux";
import UserAvatar from "../UserAvtar";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import HomeTextLoader from "../loader/HomeTextLoader";

const ChildCard = ({ navigation }) => {
  const specificChildrenDetail = useSelector(selectedChildDetailsSelector);
  const specificChildrenDetailLoading = useSelector(
    selectedChildDetailsLaodingSelector
  );
  const childProfileLoading = useSelector(authLoadingSelector);

  const dispatch = useDispatch();

  if (!specificChildrenDetail) return null;

  let content;
  if (specificChildrenDetail?.profileImageUrl) {
    content = (
      <Image
        source={{ uri: specificChildrenDetail?.profileImageUrl }}
        style={{ height: "100%", width: "100%" }}
      />
    );
  } else {
    content = (
      <UserAvatar
        profileVisibility="public"
        color={specificChildrenDetail?.color}
        nameInitial={specificChildrenDetail?.nameinitials}
        style={{
          height: "100%",
          width: "100%",
          resizeMode: "cover",
        }}
        fontSize={25}
      />
    );
  }
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 20,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        elevation: 5,
      }}
    >
      {childProfileLoading ? (
        <HomeTextLoader style={{ height: windowHeight * 0.03 }} />
      ) : (
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ color: "#A5A2A2", fontWeight: "bold", fontSize: 10 }}>
            {specificChildrenDetail?.name}
          </Text>
          <Text style={{ color: "#A5A2A2", fontSize: 7 }}>
            {specificChildrenDetail?.displayage}
          </Text>
        </View>
      )}
      <LinearGradient
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          overflow: "hidden",
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["#19C190", "#F5B700"]}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(profileSectionFetch({ section: "child_profile" }));
              navigation.navigate("MyProfile");
            }}
          >
            {!specificChildrenDetailLoading ? (
              content
            ) : (
              <LottieView
                source={require("../../../assets/lottie/planeSkelleton.json")}
                style={styles.animation}
                autoPlay
              />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    alignSelf: "center",
  },
  animation: {
    width: windowHeight * 0.24,
    height: windowHeight * 0.24,
  },
});

export default ChildCard;

import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import UserAvatar from "../UserAvtar";
import { ProfileCardPicFetch } from "../../../store/myProfile/operation";
import ellipse from "../../../assets/images/my-profile-ellipse.png";
const ProfileCard = ({
  name,
  profileImageUrl,
  nameinitials,
  color,
  onpressDot,
}) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.card}>
      <View style={styles.cardheader}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <View>
              {typeof profileImageUrl === "string" ? (
                <Image
                  source={{ uri: profileImageUrl }}
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
                  color={color}
                  nameInitial={nameinitials}
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
              {name}
            </Text>
            <Text
              style={{ fontSize: 14, textAlign: "justify", color: "#263238" }}
            >
              Parent
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={ellipse}
        style={{ position: "absolute", right: -50, top: 20 }}
      />
      <TouchableOpacity
        style={{ position: "absolute", elevation: 100, right: 0, margin: 20 }}
        onPress={onpressDot}
      >
        <Feather name="more-vertical" color="black" size={22} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 9,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    position: "relative",
  },
  cardheader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default ProfileCard;

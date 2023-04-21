import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const Profile = (props) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
      colors={["#19C190", "#F5B700"]}
    >
      <View style={styles.cardheader}>
        <TouchableOpacity onPress={props.onProfilePress}>
          <View style={{ flexDirection: "row" }}>
            {props.profileImg ? (
              <Image
                source={{ uri: props.profileImg }}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            ) : (
              <FontAwesome
                style={{ marginRight: 10 }}
                name="user-circle-o"
                size={70}
                color="black"
              />
            )}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "left",
                  marginVertical: 8,
                  color: "white",
                }}
              >
                {props.HeaderTitle}
              </Text>
              <Text
                style={{ fontSize: 14, textAlign: "justify", color: "white" }}
              >
                {props.proffesion}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ elevation: 100, right: 0 }}
          onPress={props.onPressDot}
        >
          <Feather name="more-vertical" color="white" size={22} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 9,
    marginTop: 25,
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

export default Profile;

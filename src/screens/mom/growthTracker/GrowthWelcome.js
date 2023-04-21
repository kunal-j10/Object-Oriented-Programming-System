import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import CustomHeaderButton from "../../../components/CustomHeaderButton";
import welcomeImg from "../../../../assets/images/growth-welcome-screen.png";
import { profileSectionFetch } from "../../../../store/myProfile/slice";

export default function GrowthWelcome({ navigation }) {
  const { height } = useWindowDimensions();

  const dispatch = useDispatch();

  const handleProfileNavigate = () => {
    dispatch(profileSectionFetch({ section: "child_profile" }));
    navigation.navigate("Myprofile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <Image
        source={welcomeImg}
        style={[styles.img, { height: height * 0.35 }]}
        resizeMode="cover"
      />
      <Text style={styles.txt}>
        The growth tracker helps you to keep track of your baby’s growth and
        make sure that it’s on the right path. Once you enter your baby’s
        details, we’ll provide you personalized growth charts. Regular checkups
        of your child’s weight, height and head circumference is used to
        calculate this.
      </Text>
      <TouchableOpacity onPress={handleProfileNavigate}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btn}
          colors={["#19C190", "#F5B700"]}
        >
          <Text style={styles.btnTxt}>Add Child</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  img: {
    width: "100%",
  },
  txt: {
    textAlign: "justify",
    fontSize: 16,
    marginVertical: 30,
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
});

export const GrowthWelcomeOptions = ({ navigation }) => {
  return {
    headerTitle: "Growth Tracker",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
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

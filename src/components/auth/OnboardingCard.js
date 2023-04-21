import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DefaultButton from "../DefaultButton";
import Colors from "../../../constants/Colors"

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function OnboardingCard({
  image,
  titleFirst,
  titleSecond,
  titleThird,
  subTitle,
  onSkip,
  onNext,
  isAuth,
  BtnGrp,
}) {
  return (
    <View style={styles.container}>
      {!isAuth && (
        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipTxt}>Skip</Text>
        </TouchableOpacity>
      )}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={image} resizeMode="contain" />
      </View>
      <View>
        {isAuth ? (
          <View>
            <Text style={styles.title}>{titleFirst}</Text>
            <Text style={[styles.title, styles.mainTitle]}>{titleSecond}</Text>
          </View>
        ) : (
          <Text style={styles.title}>
            {titleFirst} <Text style={styles.mainTitle}>{titleSecond}</Text>{" "}
            {titleThird}
          </Text>
        )}
        <Text style={styles.subTitle}>{subTitle}</Text>
        {isAuth ? (
          <BtnGrp />
        ) : <DefaultButton onPress={onNext} type="small" text="Next" isFullWidth = {true}/> }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    width: windowWidth,
  },
  skipBtn: {
    alignSelf: "flex-end",
    marginBottom: 6,
  },
  skipTxt: {
    color: Colors.brandPrimary.default,
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 84,
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: windowHeight * 0.38,
  },
  title: {
    color: Colors.brandPrimary.default,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: windowWidth * 0.8,
    alignSelf: "center",
  },
  mainTitle: {
    color: Colors.brandSecondary.dark,
  },
  subTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 48,
  },
  nextBtn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
  },
  nextTxt: {
    color: "white",
    fontSize: 16,
  },
});

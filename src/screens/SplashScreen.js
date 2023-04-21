import React from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import AppLogo from "../../assets/images/adaptive-icon.png";
import SplashScreenLoader from "../components/loader/SplashScreenLoader";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />

      <Image style={{ width: 200, height: 200 }} source={AppLogo} />
      <Text style={{ fontWeight: "bold", fontSize: 20, position: "relative" }}>
        Logging you in
      </Text>
      <SplashScreenLoader
        style={{
          position: "absolute",
          width: 150,
          height: 150,
          bottom: -30,
          left: 3,
          elevation: -2,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
export default SplashScreen;

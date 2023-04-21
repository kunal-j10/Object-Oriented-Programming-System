import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../../constants/Colors";
import noInternetImg from "../../assets/images/no-internet.jpg";
import { refreshToken } from "../../store/auth/operation";
import {
  parentIdSelector,
  refreshTokenSelector,
} from "../../store/auth/selector";

export default function RetryScreen() {
  const refreshingToken = useSelector(refreshTokenSelector);
  const parentId = useSelector(parentIdSelector);

  const dispatch = useDispatch();

  const retryHandler = async () => {
    dispatch(
      refreshToken({
        refreshToken: refreshingToken,
        parentId,
        afterNetworkError: true,
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image source={noInternetImg} style={styles.img} resizeMode="contain" />
      <Text style={styles.header}>Oops!</Text>
      <Text style={styles.subHeader}>No Internet</Text>
      <Text style={styles.txt}>Please check your internet connection</Text>
      <TouchableOpacity onPress={retryHandler}>
        <View style={styles.tryAgainBtn}>
          <Text style={styles.tryAgainTxt}>Try Again</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  img: {
    width: "90%",
    height: "60%",
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  subHeader: {
    fontSize: 20,
    fontStyle: "italic",
    color: Colors.textPrimary,
  },
  txt: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  tryAgainBtn: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 15,
  },
  tryAgainTxt: {
    color: Colors.primary,
    fontSize: 18,
  },
});

import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import { refreshFailedSelector } from "../../store/auth/selector";
import { executeActionsOnInternet } from "../../store/auth/operation";
import { authBlacklistChangeInternetReachable } from "../../store/authBlacklist/slice";
import { authBlacklistInitialLoadingSelector } from "../../store/authBlacklist/selector";

export default function OfflineBanner() {
  const netInfo = useNetInfo();
  const refreshFailed = useSelector(refreshFailedSelector);
  const authInitialLoading = useSelector(authBlacklistInitialLoadingSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (netInfo.isInternetReachable === true) {
      dispatch(executeActionsOnInternet());
    }

    dispatch(
      authBlacklistChangeInternetReachable(netInfo.isInternetReachable === true)
    );
  }, [netInfo.isInternetReachable]);

  if (
    !authInitialLoading &&
    !refreshFailed &&
    netInfo.isInternetReachable === false
  )
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>No Internet Connection</Text>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    height: 50,
    backgroundColor: "#ED3E5B",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  txt: {
    color: "#fff",
    fontSize: 20,
  },
});

import "react-native-gesture-handler";
import React from "react";
import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";

import App from "./App";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // console.log("Message handled in the background!", remoteMessage);
});

const HeadlessCheck = (props) => {
  if (props.isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
};

registerRootComponent(HeadlessCheck);

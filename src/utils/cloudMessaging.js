import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";

import pushConfig from "../../constants/pushConfig";
import { sendFCMToken } from "../../store/auth/operation";

export default cloudMessaging = async (dispatch) => {
  crashlytics().log("Listening to the push notification");
  try {
    let authStatus = await messaging().hasPermission();
    if (
      authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
      authStatus !== messaging.AuthorizationStatus.PROVISIONAL
    ) {
      authStatus = await messaging().requestPermission();
    }
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await messaging().subscribeToTopic(pushConfig.defaultTopic);

      // It will trigger when app was in background
      messaging().onNotificationOpenedApp((remoteMessage) => {
        // console.log("onNotificationOpenedApp", remoteMessage);
      });

      const initialMessage = await messaging().getInitialNotification();
      // console.log({ initialMessage });

      // If App is in foreground mode
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        // console.log("Message handled in the foreground!", remoteMessage);
      });

      return unsubscribe;
    }
  } catch (err) {
    crashlytics().recordError(err);
  }
};

export const sendToken = async (dispatch) => {
  crashlytics().log("Sending firebase cloud message token");
  try {
    let authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      token = await messaging().getToken();
      dispatch(sendFCMToken(token));
    }
  } catch (err) {
    crashlytics().recordError(err);
  }
};

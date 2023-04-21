import mime from "mime";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import crashlytics from "@react-native-firebase/crashlytics";
import { Platform } from "react-native";

import { authAxios } from "../services/axios";

export default uploadFile = async ({
  refreshToken,
  firebaseToken,
  ttl,
  refString,
  uri,
}) => {
  try {
    if (ttl <= new Date().getTime()) {
      const res = await authAxios.post(
        "/parent/refresh-token",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          refreshing: true,
        }
      );
      firebaseToken = res.data.firebaseToken;
    }

    let error;

    uri = Platform.OS === "android" ? uri : uri.replace("file://", "");

    const userCredential = await auth().signInWithCustomToken(firebaseToken);

    const task = await storage()
      .ref(refString)
      .putFile(uri)
      .catch((err) => {
        error = err;
      });

    if (error) return { error };

    const mediaUrl = await storage()
      .ref(task.metadata.fullPath)
      .getDownloadURL();

    return {
      fileName: task.metadata.name,
      fileType: mime.getType(uri),
      mediaUrl,
      sizeInBytes: task.metadata.size,
      filePath: refString,
    };
  } catch (err) {
    crashlytics().recordError(err);
    return { error: err };
  }
};

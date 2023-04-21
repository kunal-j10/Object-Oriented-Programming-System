import { Platform } from "react-native";
import moment from "moment";
import RNFetchBlob from "rn-fetch-blob";

const {
  dirs: { DownloadDir, DocumentDir },
} = RNFetchBlob.fs;
const { config } = RNFetchBlob;

export default downloadFile = async ({ fileUrl, fileType, fileName }) => {
  const isIOS = Platform.OS === "ios";
  const directoryPath = Platform.select({
    ios: DocumentDir,
    android: DownloadDir,
  });
  const filePath = directoryPath + "/Adwaita Educare/" + fileName;
  // const filePath =
  //   directoryPath +
  //   "/Adwaita Educare/" +
  //   moment(new Date()).format("YYYYMMDD_HHmmss_") +
  //   fileName;
  const fileExt = fileName.split(".").pop();

  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: filePath,
      mime: fileType,
      appendExt: fileExt,
      notification: true,
      title: fileName,
    },

    android: {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        mediaScannable: true,
        description: fileName,
        title: fileName,
      },
    },
  });

  const res = await config(configOptions).fetch("GET", fileUrl);
  if (isIOS) {
    setTimeout(() => {
      // RNFetchBlob.ios.previewDocument('file://' + res.path());
      RNFetchBlob.ios.openDocument(res.data);
    }, 300);
  } else {
    RNFetchBlob.android.actionViewIntent(res.path(), fileType);
  }
};

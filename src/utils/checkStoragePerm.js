import { Alert, PermissionsAndroid, Platform } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";

export default checkStoragePerm = async (funcToExec) => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  try {
    if (Platform.OS === "ios") {
      funcToExec();
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "Application needs access to your storage to download File",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        funcToExec();
      } else {
        // If permission denied then show alert
        Alert.alert("Error", "Storage Permission Not Granted");
      }
    }
  } catch (err) {
    // To handle permission related exception
    crashlytics().log("checkStoragePerm or download error:");
    crashlytics().recordError(err);
  }
};

// https://firebasestorage.googleapis.com/v0/b/adwaita-dev.appspot.com/o/healthStorage%2FparentId_61a29360602dbba02313a743%2FchildId_61a293b73ef5d00fdaf6aaf8%2F61ec2edb2b573f36da5146cd_Folder%2F61ec2ef32b573f1b425146d2_Folder%2F61ec35582b573f3f925146e8_Folder%2F61ec35682b573f9c4e5146eb_Folder%2F61ec35752b573fbbad5146ee_Folder%2F61ec35802b573fafb55146f1_Fol%2F61ec358b2b573ff8005146f4_Fo%2F61ec35972b573f47bb5146f7_Fol%2F61ec35bf2b573f012d5146fe_Fol%2F61ec35ca2b573fbf2c514701_Fol%2F61ec35da2b573f673b514704_Fold%2Fsample.pdf?alt=media&token=46494c9b-a21e-45a9-8f0e-5e782b19efdb

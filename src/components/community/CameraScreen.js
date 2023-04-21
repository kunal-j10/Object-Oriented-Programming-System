import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import crashlytics from "@react-native-firebase/crashlytics";

const CameraScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageObject, setImageObject] = useState(null);

  let returnScreen = props.route.params.returnScreen;

  // Camera ref
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      setHasPermission(status === "granted");
    })();
  }, []);

  // Take the photo

  const CapturePhoto = async (props) => {
    if (cameraRef) {
      try {
        let { height, uri, width } = await cameraRef.current.takePictureAsync();
        const fileName = uri.split("/").pop();
        const { size: sizeInBytes } = await FileSystem.getInfoAsync(uri, {
          size: true,
        });
        setImageObject({ height, width, uri, fileName, sizeInBytes });
      } catch (err) {
        crashlytics().log(
          "capturing photo in camera screen -> capturePhoto method"
        );
        crashlytics().recordError(err);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (imageObject !== null) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: imageObject.uri }}
          style={{ width: "100%", height: "100%" }}
        />
        <View style={styles.imageButtonContainer}>
          <View style={styles.imageSelectionButtons}>
            <TouchableOpacity
              onPress={() => {
                setImageObject(null);
              }}
            >
              <Entypo name="circle-with-cross" size={50} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate({
                  name: returnScreen,
                  params: { imageObject: imageObject },
                  merge: true,
                });
              }}
              style={styles.imageSelectionButtons}
            >
              <Ionicons name="checkmark-circle" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="camera-reverse-outline" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={CapturePhoto}>
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 30,
  },
  button: {
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  imageButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  imageSelectionButtons: {
    padding: 5,
    // marginHorizontal:30
  },
});

export default CameraScreen;

import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import RadioButton from "./RadioButton";
import Button from "../../components/Button";
import { childProfilePicFetch } from "../../../store/myProfile/operation";
import { useDispatch } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateInput from "../../components/auth/DateInput";
import UserAvatar from "../UserAvtar";
const ChildProfile = (props) => {
  const dispatch = useDispatch();
  const [edit, setedit] = useState(false);
  const [isDobVisible, setIsDobVisible] = useState(false);

  const TakePhotofromGallery = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
    })
      .then((image) => {
        dispatch(childProfilePicFetch({ id: props.childId, path: image.path }));
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  };
  const handleConfirm = (date) => {
    setisModalVisible(false);
  };
  const changetoMale = () => {
    props.setgender("gender", "boy");
  };
  const changetoFemale = () => {
    props.setgender("gender", "girl");
  };

  const SubmitHandler = ()=>{
    props.handleSubmit();
    setedit(!edit)
  }
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            props.activeId === props.childId && !edit ? "#C1FFDA" : "#FFFFFF",
        },
      ]}
    >
      <View style={styles.cardheader}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={edit ? TakePhotofromGallery : null}>
            {props.isProfilepic ? (
              <Image
                source={{ uri: props.profileurl }}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: "#03B44D",
                }}
              />
            ) : (
              <UserAvatar
                profileVisibility="public"
                color={props.color}
                nameInitial={props.nameinitials}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: "#03B44D",
                }}
              />
            )}

            {/* <Image
              source={
                props.isProfilepic ? { uri: props.profileurl } : defaultAvatar
              }
              style={{
                height: 78,
                width: 78,
                borderRadius: 39,
                marginRight: 10,
                borderWidth: 2,
                borderColor: "#03B44D",
              }}
            /> */}
            {edit ? (
              <FontAwesome
                color="#03B44D"
                name="camera"
                size={16}
                style={{ position: "absolute", bottom: 0, right: "9%" }}
              />
            ) : null}
          </TouchableOpacity>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "left",
                color: "black",
              }}
            >
              {props.childName}
            </Text>
            <Text
              style={{ fontSize: 14, textAlign: "justify", color: "#263238" }}
            >
              {props.childbio}
            </Text>
          </View>
        </View>

        <View style={{ justifyContent: "space-between" }}>
          <TouchableOpacity onPress={props.onpressRadio}>
            <RadioButton
              selected={props.activeId === props.childId ? true : false}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setedit(!edit)}>
            {edit ? (
              <MaterialIcons
                style={{ marginRight: 10 }}
                name="edit-off"
                size={22}
                color="#03B44D"
              />
            ) : (
              <MaterialIcons
                style={{ marginRight: 10 }}
                name="edit"
                size={22}
                color="#03B44D"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {edit ? (
          <View style={{ flex: 1, marginTop: 10 }}>
            <Text style={styles.text}>Name</Text>
            <TextInput
              onBlur={props.onNameBlur}
              onChangeText={props.onChangeName}
              value={props.inputname}
              placeholder="Enter Child's Name"
              style={styles.textinput}
            />
            <Text style={styles.error}>{props.nameError}</Text>
            <DateInput
              textstyle={styles.text}
              name="dob"
              value={props.inputdob}
              title="Date of Birth"
              error={props.dobError}
              onChange={props.setDate}
              setIsModalVisible={setIsDobVisible}
              isModalVisible={isDobVisible}
            />

            <Text style={styles.error}>{props.dobError}</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "rgba(24, 20, 31, 0.6)",
                    fontSize: 18,
                    marginRight: 5,
                  }}
                >
                  Boy
                </Text>
                <TouchableOpacity onPress={changetoMale}>
                  <RadioButton
                    selected={props.inputgender === "boy" ? true : false}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                }}
              >
                <Text
                  style={{
                    color: "rgba(24, 20, 31, 0.6)",
                    fontSize: 18,
                    marginRight: 5,
                  }}
                >
                  Girl
                </Text>
                <TouchableOpacity onPress={changetoFemale}>
                  <RadioButton
                    selected={props.inputgender === "girl" ? true : false}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Button
              style={{ marginTop: 10 }}
              title="Save"
              onPress={SubmitHandler}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontSize: 13,
    color: "red",
  },
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 27,
    padding: 20,
  },
  cardheader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
  },
  textinput: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    height: 47,
    borderWidth: 1,
    borderColor: "#03B44D",
    borderRadius: 25,
  },
});

export default ChildProfile;

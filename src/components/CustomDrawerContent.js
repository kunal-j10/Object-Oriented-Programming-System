import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import Share from "react-native-share";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";


import UserAvatar from "./UserAvtar";
import {
  childrenDetailsSelector,
  parentDetailsSelector,
  selectedChildDetailsSelector,
} from "../../store/auth/selector";
import { logout } from "../../store/auth/operation";
import { profileSectionFetch } from "../../store/myProfile/slice";
import { getDynamicLink } from "../utils/generateDynamicLink"
import { navigationRef } from "../screens/NavigationRefScreen";

const HEIGHT = Dimensions.get("window").height;

export default CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const specificChildrenDetail = useSelector(selectedChildDetailsSelector);
  const childrenDetails = useSelector(childrenDetailsSelector);
  const parentdetails = useSelector(parentDetailsSelector);

  const handleLogout = () => {
    dispatch(logout());
  };

  //Generate shareable link for any post
  const generateShareableLink = async () => {
    try {
      let link = await getDynamicLink({
        state: navigationRef.getRootState()
      });
      

      const shareoptions = {
        url: link,
      };
      const ShareResponse = await Share.open(shareoptions);
    } catch (err) {
      console.log("Error = ", err);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        height: "100%",
        justifyContent: "space-around",
      }}
    >
      {/* <DrawerItemList {...props} /> */}
      <View>
        <TouchableOpacity
          onPress={() => {
            dispatch(profileSectionFetch({ section: "my_profile" }));
            props.navigation.navigate("MyProfile");
          }}
        >
          <View style={styles.avatar}>
            {parentdetails.hasOwnProperty("profileImageUrl") ? (
              <Image
                source={{ uri: parentdetails.profileImageUrl }}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                  overflow: "hidden",
                }}
              />
            ) : (
              <UserAvatar
                profileVisibility="public"
                color={parentdetails?.color}
                nameInitial={parentdetails?.nameinitials}
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                  overflow: "hidden",
                }}
              />
            )}

            <View style={{ width: "70%", marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: HEIGHT > 600 ? 18 : 14,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {parentdetails.name}
              </Text>
              {/* <Text style={{ fontSize: 12, color: "white" }}>
                Mother of 8 year old
              </Text> */}
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={{ marginLeft: 25 }}>
          <DrawerItem
            style={{ marginTop: 10 }}
            icon={({ focused, color, size }) => (
              <FontAwesome
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"user-circle"}
              />
            )}
            label="My Profile"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() => props.navigation.navigate('CommunityScreen', {
              screen: 'ParentProfile',
              params:  { parentId: parentdetails._id },
            })}
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <MaterialIcons
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"escalator-warning"}
              />
            )}
            label="My Activities"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "ActivitiesNavigator",
              })
            }
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <MaterialIcons
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"sticky-note-2"}
              />
            )}
            label="Assessments"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "AssessmentsNavigator",
              })
            }
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <MaterialIcons
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"message"}
              />
            )}
            label="Feedback"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("DrawerNavigator", {
                screen: "Feedback",
              })
            }
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <FontAwesome
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"share-alt"}
              />
            )}
            label="Share"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={generateShareableLink}
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <FontAwesome
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"question-circle-o"}
              />
            )}
            label="FAQ"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("DrawerNavigator", {
                screen: "FaQ",
              })
            }
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <MaterialIcons
                style={{ marginLeft: -3 }}
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"error-outline"}
              />
            )}
            label="About Us"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("DrawerNavigator", {
                screen: "AboutUs",
              })
            }
          />
          <DrawerItem
            style={{ marginTop: HEIGHT > 600 ? -10 : -20 }}
            icon={({ focused, color, size }) => (
              <FontAwesome
                color="white"
                size={HEIGHT > 600 ? 24 : 20}
                name={"phone"}
              />
            )}
            label="Contact Us"
            labelStyle={{
              marginLeft: -15,
              color: "white",
              fontWeight: "bold",
              fontSize: HEIGHT > 600 ? 18 : 14,
            }}
            onPress={() =>
              props.navigation.navigate("DrawerNavigator", {
                screen: "ContactUs",
              })
            }
          />
        </View>
      </View>

      <View
        style={{
          borderRadius: 30,
          overflow: "hidden",
          marginLeft: 30,
          width: 120,
        }}
      >
        <TouchableNativeFeedback onPress={handleLogout}>
          <View
            style={{
              paddingHorizontal: 10,
              // marginBottom: "5%"
              paddingVertical: 8,
              borderRadius: 30,
              backgroundColor: "white",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: HEIGHT > 600 ? 18 : 14,
                color: "#455A64",
              }}
            >
              Sign-out
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginLeft: 30,
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  childrens: {
    marginLeft: "28%",
    marginTop: 5,
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-around",
  },
  childavtar: {
    width: "100%",
    flexDirection: "row",
  },
  button: {
    marginTop: 10,
    marginLeft: 20,
    borderRadius: 42,
    flexDirection: "row",
    width: 80,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
});

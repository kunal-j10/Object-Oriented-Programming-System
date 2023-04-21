import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { parentDetailsFetch } from "../../store/auth/operation";
import Tabnavigator from "./Tabnavigator";
import MyProfile from "../screens/sideDrawer/MyProfile";
import FaQ from "../screens/sideDrawer/FaQ";
import AboutUs from "../screens/sideDrawer/AboutUs";
import ContactUs from "../screens/sideDrawer/ContactUs";
import Feedback from "../screens/sideDrawer/Feedback";
import CustomDrawerContent from "../components/CustomDrawerContent";
import {
  parentIdSelector,
  refreshTokenSelector,
} from "../../store/auth/selector";

const Drawer = createDrawerNavigator();

export default DrawerNavigator = (props) => {
  const refreshToken = useSelector(refreshTokenSelector);
  const parentId = useSelector(parentIdSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(parentDetailsFetch({status:"loading"}));
  }, []);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
      colors={["#19C190", "#7ED9A4"]}
    >
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: {
            flex: 1,
            width: "65%",
            backgroundColor: "transparent",
          },
          overlayColor: "transparent",
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
        }}
        initialRouteName="TabNavigator"
        drawerContent={(props) => {
          return <CustomDrawerContent navigation={props.navigation} />;
        }}
      >
        <Drawer.Screen name="TabNavigator" component={Tabnavigator} />
        <Drawer.Screen name="MyProfile" component={MyProfile} />
        <Drawer.Screen name="FaQ" component={FaQ} />
        <Drawer.Screen name="ContactUs" component={ContactUs} />
        <Drawer.Screen name="Feedback" component={Feedback} />
        <Drawer.Screen name="AboutUs" component={AboutUs} />
      </Drawer.Navigator>
    </LinearGradient>
  );
};

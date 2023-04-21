import React from "react";
// import Animated from "react-native-reanimated";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useDrawerProgress } from "@react-navigation/drawer";

import Colors from "../../constants/Colors";
import Home from "../screens/home";
import Shop from "../screens/shop";
import Kid from "../screens/kid";
import MomNavigator from "../screens/mom";
import Community from "../screens/community";

const Tab = createBottomTabNavigator();

export default TabNavigator = () => {
  // const progress = useDrawerProgress();

  // const scale = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [1, 0.8],
  // });

  // const borderRadius = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, 30],
  // });

  // const animatedStyle = {
  //   flex: 1,
  //   borderRadius,
  //   transform: [{ scale }],
  //   overflow: "hidden",
  // };
  
  return (
    // <Animated.View style={animatedStyle}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.iconColor,
        }}
        backBehavior="initialRoute"
        initialRouteName="Home"
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        {/* <Tab.Screen
        name="Shop"
        component={Shop}
        options={{
          tabBarLabel: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-bag" size={size} color={color} />
          ),
        }}
      /> */}
        <Tab.Screen
          name="CommunityScreen"
          component={Community}
          options={({ navigation }) => ({
            tabBarButton: (props) => (
              <Pressable
                {...props}
                onPress={() =>
                  navigation.navigate("CommunityScreen", {
                    screen: "Community",
                  })
                }
              />
            ),
            tabBarLabel: "Community",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="group" size={size} color={color} />
            ),
          })}
        />

        <Tab.Screen
          name="Kid"
          component={Kid}
          options={({ navigation }) => ({
            tabBarButton: (props) => (
              <Pressable
                {...props}
                onPress={() =>
                  navigation.navigate("Kid", { screen: "KidStack" })
                }
              />
            ),
            tabBarLabel: "Kid",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="baby-face"
                size={size}
                color={color}
              />
            ),
          })}
        />
        <Tab.Screen
          name="MomNavigator"
          component={MomNavigator}
          options={({ navigation }) => ({
            tabBarButton: (props) => (
              <Pressable
                {...props}
                onPress={() =>
                  navigation.navigate("MomNavigator", { screen: "Mom" })
                }
              />
            ),
            tabBarLabel: "Mom",
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="female" size={size} color={color} />
            ),
          })}
        />
      </Tab.Navigator>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

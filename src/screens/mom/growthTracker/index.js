import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Dimensions } from "react-native";

import GrowthTracker, { GrowthTrackerOptions } from "./GrowthTracker";
import GrowthWelcome, { GrowthWelcomeOptions } from "./GrowthWelcome";
import { selectedChildIdSelector } from "../../../../store/auth/selector";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import Colors from "../../../../constants/Colors";

const Tab = createMaterialTopTabNavigator();

export default function GrowthTrackerNavigator() {
  const selectedChildId = useSelector(selectedChildIdSelector);

  if (!selectedChildId) {
    return <GrowthWelcome />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIndicatorStyle: { backgroundColor: Colors.primary },
        tabBarLabelStyle: { fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="Weight"
        component={GrowthTracker}
        options={{ tabBarLabel: "Weight" }}
      />
      <Tab.Screen
        name="Height"
        component={GrowthTracker}
        options={{ tabBarLabel: "Height" }}
      />
      <Tab.Screen
        name="HeadCircle"
        component={GrowthTracker}
        options={{ tabBarLabel: "Head Circle" }}
      />
    </Tab.Navigator>
  );
}

export const GrowthOptions = ({ navigation }) => {
  return {
    headerTitle: "Growth Tracker",
    headerTitleAlign: "center",
    headerShown: true,
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};

import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";

import Mom, { MomOptions } from "./Mom";
import GrowthTrackerNavigator, { GrowthOptions } from "./growthTracker";
import HealthNavigator from "./health";
import LullabyRhymesNavigator from "./lullabyRhymes";
import RecipesNavigator from "./recipes";
import ReportsNavigator from "./reports";
import SleepNavigator from "./sleep";
import StoriesNavigator from "./stories";
import Vaccination, { VaccinationOptions } from "./vaccination/Vaccination";
import { rhymesInFullScreenSelector } from "../../../store/rhymes/selector";

import { createStackNavigator } from "@react-navigation/stack";
import { useNavigationState } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import ActivitiesNavigator from "./activities";
import AssessmentsNavigator from "./assessments";

const Stack = createStackNavigator();

export default function MomNavigator({ navigation }) {
  //getting navigation state for hiding tab bar
  const navigationState = useNavigationState((state) => state?.routes[3]);

  useLayoutEffect(() => {
    const currentRouteIndex = navigationState?.state?.index;
    const currentRouteName =
      navigationState?.state?.routes?.[currentRouteIndex]?.name;

    const routeName = currentRouteName ?? "Mom";

    if (
      (navigationState?.params?.screen === "Mom" && routeName === "Mom") ||
      currentRouteName === "Mom"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    }
  }, [navigationState]);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Mom"
    >
      <Stack.Screen name="Mom" component={Mom} options={MomOptions} />
      <Stack.Screen
        name="ActivitiesNavigator"
        component={ActivitiesNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssessmentsNavigator"
        component={AssessmentsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GrowthTrackerNavigator"
        component={GrowthTrackerNavigator}
        options={GrowthOptions}
      />
      <Stack.Screen name="HealthNavigator" component={HealthNavigator} />
      <Stack.Screen
        name="LullabyRhymesNavigator"
        component={LullabyRhymesNavigator}
      />
      <Stack.Screen name="RecipesNavigator" component={RecipesNavigator} />
      <Stack.Screen name="ReportsNavigator" component={ReportsNavigator} />
      <Stack.Screen name="SleepNavigator" component={SleepNavigator} />
      <Stack.Screen name="StoriesNavigator" component={StoriesNavigator} />
      <Stack.Screen
        name="Vaccination"
        component={Vaccination}
        options={VaccinationOptions}
      />
    </Stack.Navigator>
  );
}

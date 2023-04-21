import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Health, { HealthOptions } from "./Health";

const Stack = createStackNavigator();

export default function HealthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Health"
        component={Health}
        options={HealthOptions}
      />
    </Stack.Navigator>
  );
}

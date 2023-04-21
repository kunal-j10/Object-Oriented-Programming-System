import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Stories, { StoriesOptions } from "./Stories";

const Stack = createStackNavigator();

export default function StoriesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Stories"
        component={Stories}
        options={StoriesOptions}
      />
    </Stack.Navigator>
  );
}

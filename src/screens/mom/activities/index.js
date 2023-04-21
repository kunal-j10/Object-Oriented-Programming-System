import React from "react";

import Activities, { ActivitiesOptions } from "./Activities";
import ActivityContent, { ActiivityContentOptions } from "./ActivityContent";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function ActivitiesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activities"
        component={Activities}
        options={ActivitiesOptions}
      />
      <Stack.Screen
        name="ActivityContent"
        component={ActivityContent}
        options={ActiivityContentOptions}
      />
    </Stack.Navigator>
  );
}

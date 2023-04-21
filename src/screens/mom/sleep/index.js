import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SleepStack from "./SleepStack";
import SleepRecorder, { SleepRecorderOptions } from "./SleepRecorder";

const Stack = createStackNavigator();

export default function SleepNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="SleepStack"
        component={SleepStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SleepRecorder"
        component={SleepRecorder}
        options={SleepRecorderOptions}
      />
    </Stack.Navigator>
  );
}

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LullabyRhymes, { LullabyRhymesOptions } from "./LullabyRhymes";
import RhymesVideoDetail from "./RhymesVideoDetail";
import RhymesRecording, { RhymesRecordingOptions } from "./RhymesRecording";

const Stack = createStackNavigator();

export default function LullabyRhymesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LullabyRhymes"
        component={LullabyRhymes}
        options={LullabyRhymesOptions}
      />
      <Stack.Screen
        name="RhymesVideoDetail"
        component={RhymesVideoDetail}
        options={{
          presentation: "modal",
          gestureEnabled: true,
          headerShown: false,
          gestureResponseDistance: 250,
        }}
      />
      <Stack.Screen
        name="RhymesRecording"
        component={RhymesRecording}
        options={RhymesRecordingOptions}
      />
    </Stack.Navigator>
  );
}

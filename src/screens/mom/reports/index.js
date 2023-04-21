import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Reports, { ReportsOptions } from "./Reports";

const Stack = createStackNavigator();

export default function ReportsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reports"
        component={Reports}
        options={ReportsOptions}
      />
    </Stack.Navigator>
  );
}

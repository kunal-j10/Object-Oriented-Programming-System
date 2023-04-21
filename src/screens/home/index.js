import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage, { HomeOptions } from "./HomePage";

const Stack = createStackNavigator();
export default ({navigation}) => {
  

  return (
    <Stack.Navigator
    screenOptions={{ headerShown: true }}
    >
      
        <Stack.Screen
          name="HomePage"
          component={HomePage}
        options = {HomeOptions}
        />
      
    </Stack.Navigator>
  );
};
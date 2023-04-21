import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Shop, { ShopOptions } from '../shop/Shop';


const Stack = createStackNavigator();
export default (props) => {
  const navigation = props.navigation;

  return (
    <Stack.Navigator
    screenOptions={{ headerShown: true }}
    >
      
        <Stack.Screen
          name="ShopStack"
          component={Shop}
        options = {ShopOptions}
        />
      
    </Stack.Navigator>
  );
};

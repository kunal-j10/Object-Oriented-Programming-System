import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Kid, { KidOptions } from "./Kid";
import VideoDetail, { VideoDetailOptions } from "./VideoDetail";
import KidCategory, { KidCategoryOptions } from "./KidCategory";

const Stack = createStackNavigator();
export default ({navigation}) => {
  

  return (
    <Stack.Navigator
      // initialRouteName="VideoDetail"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Group>
        <Stack.Screen name="KidStack" component={Kid} options={KidOptions} />
        <Stack.Screen
          name="KidCategory"
          component={KidCategory}
          options={KidCategoryOptions}
        />
        <Stack.Screen
          name="VideoDetail"
          component={VideoDetail}
          options={{
            presentation: "modal",
            gestureEnabled: true,
            headerShown: false,
            gestureResponseDistance: 300,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
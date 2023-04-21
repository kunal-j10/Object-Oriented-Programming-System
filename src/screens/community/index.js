import React, { useLayoutEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Community, { CommunityOptions } from "./Community";
import ExpertProfile, { ExpertOptions } from "./ExpertProfile";
import SharePost from "./SharePost";
import ShareQuestion from "./ShareQuestion";
import Comments from "./Comments";
import SearchPost from "./SearchPost";
import { useNavigationState } from "@react-navigation/native";
import ParentProfile from "./ParentProfile";
import { ParentProfileOptions } from "./ParentProfile";

const Stack = createStackNavigator();

export default ({ navigation }) => {
  //getting navigation state for hiding tab bar
  const navigationState = useNavigationState((state) => state?.routes[1]);

  useLayoutEffect(() => {
    const currentRouteIndex = navigationState?.state?.index;
    const currentRouteName =
      navigationState?.state?.routes?.[currentRouteIndex]?.name;

    const routeName = currentRouteName ?? "Community";

    if (
      (navigationState?.params?.screen === "Community" &&
        routeName === "Community") ||
      currentRouteName === "Community"
    ) {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    }
  }, [navigationState]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Community"
        component={Community}
        options={CommunityOptions}
      />
      <Stack.Screen
        name="ExpertProfile"
        component={ExpertProfile}
        options={ExpertOptions}
      />
      <Stack.Screen
        name="SharePost"
        component={SharePost}
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="ShareQuestion"
        component={ShareQuestion}
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchPost"
        component={SearchPost}
        options={{ presentation: "modal", headerShown: false }}
      />
       <Stack.Screen
        name="ParentProfile"
        component={ParentProfile}
        options={ParentProfileOptions}
      />
    </Stack.Navigator>
  );
};

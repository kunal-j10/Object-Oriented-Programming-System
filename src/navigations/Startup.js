import React, { useState, useEffect, useRef } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-root-toast";
import analytics from "@react-native-firebase/analytics";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import merge from "deepmerge";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import {
  authErrorSelector,
  isAuthenticatedSelector,
  isFirstTimeSelector,
  parentIdSelector,
  refreshFailedSelector,
  refreshTokenSelector,
  ttlSelector,
} from "../../store/auth/selector";
import {
  removeAuthError,
  firstTimeUser,
  refreshToken,
} from "../../store/auth/operation";
import { themeIsDarkThemeSelector } from "../../store/theme/selector";

import DrawerNavigator from "./DrawerNavigator";
import AuthInterceptor from "../screens/AuthInterceptor";
import SplashScreen from "../screens/SplashScreen";
import Onboarding from "../screens/auth/Onboarding";
import Login from "../screens/auth/Login";
import SignUp from "../screens/auth/SignUp";
import ForgetPass, { ForgetPassOptions } from "../screens/auth/ForgetPass";
import LoginOtp, { LoginOtpOptions } from "../screens/auth/LoginOtp";
import ChangePass, { ChangePassOptions } from "../screens/auth/ChangePass";
import SignUpOtp from "../screens/auth/SignUpOtp";
import AddChild from "../screens/auth/AddChild";
import LoginSignUpTopNavigator from "../screens/auth/LoginSignUpTopNavigator";
import OfflineBanner from "../components/OfflineBanner";
import RetryScreen from "../screens/RetryScreen";
import CameraScreen from "../components/community/CameraScreen";
import Gallery from "../screens/Gallery";
import ReportSuggestion from "../screens/community/ReportSuggestion";
import linking from "../utils/linking";
import { navigationRef } from "../screens/NavigationRefScreen";
import { authBlacklistInitialLoading } from "../../store/authBlacklist/slice";
import { authBlacklistInitialLoadingSelector } from "../../store/authBlacklist/selector";


const Stack = createStackNavigator();


const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const CustomisedDefaultTheme = {
  ...CombinedDefaultTheme,
};

const CustomisedDarkTheme = {
  ...CombinedDarkTheme,
};

export default StartUp = () => {
  const isLoading = useSelector(authBlacklistInitialLoadingSelector);
  const isFirstTime = useSelector(isFirstTimeSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const ttl = useSelector(ttlSelector);
  const refreshingToken = useSelector(refreshTokenSelector);
  const parentId = useSelector(parentIdSelector);
  const refreshFailed = useSelector(refreshFailedSelector);
  const isDarkTheme = useSelector(themeIsDarkThemeSelector);

  const errorToast = useSelector(authErrorSelector);

  const dispatch = useDispatch();

  const routeNameRef = useRef(null);

  let theme = isDarkTheme ? CustomisedDarkTheme : CustomisedDefaultTheme;

  // displaying error generated in authentication
  useEffect(() => {
    if (errorToast !== "") {
      Toast.show(errorToast, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(removeAuthError());
        },
      });
    }
  }, [errorToast]);

  // checking whether the user has open the app for first time or not
  useEffect(() => {
    if (isFirstTime == null) {
      dispatch(firstTimeUser(true));
    }
  }, []);

  // refreshing the access token if refreshtoken exists and ttl is expired
  useEffect(() => {
    if (isAuthenticated && ttl > new Date().getTime()) {
      dispatch(authBlacklistInitialLoading(false));
    } else if (refreshingToken && parentId) {
      dispatch(authBlacklistInitialLoading(true));
      dispatch(refreshToken({ refreshToken: refreshingToken, parentId }));
    } else {
      dispatch(authBlacklistInitialLoading(false));
    }
  }, [isFirstTime, isAuthenticated, ttl, refreshingToken, parentId]);

  // // refreshing the token if the app is not open by the for first time and parentid, refreshtoken exists in secure store
  // useEffect(() => {
  //   isFirstTime != null &&
  //     checkTokenInSecureStore(isAuthenticated, ttl, dispatch);
  // }, [isAuthenticated, isFirstTime, ttl]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={theme}
        ref={navigationRef}
        linking={linking}
        fallback={null}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <AuthInterceptor />
        <OfflineBanner />

        <Stack.Navigator>
          {isFirstTime == null || isLoading ? (
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
          ) : refreshFailed ? (
            <Stack.Screen
              name="RetryScreen"
              component={RetryScreen}
              options={{ headerShown: false }}
            />
          ) : !isAuthenticated ? (
            <>
              {isFirstTime && (
                <Stack.Screen
                  name="Onboarding"
                  options={{ headerShown: false }}
                  component={Onboarding}
                />
              )}
               <Stack.Screen
                name="LoginSignUpTopNavigator"
                options={{ headerShown: false }}
                component={LoginSignUpTopNavigator}
              />
              {/* <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              /> */}
              <Stack.Screen
                name="LoginOtp"
                options={LoginOtpOptions}
                component={LoginOtp}
              />
              <Stack.Screen
                name="ForgetPass"
                options={ForgetPassOptions}
                component={ForgetPass}
              />
              <Stack.Screen
                name="ChangePass"
                options={ChangePassOptions}
                component={ChangePass}
              />
              {/* <Stack.Screen
                name="SignUp"
                options={{ headerShown: false }}
                component={SignUp}
              /> */}
              <Stack.Screen
                name="SignUpOtp"
                options={{ headerShown: false }}
                component={SignUpOtp}
              />
            </>
          ) : (
            <Stack.Screen
              name="DrawerNavigator"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="AddChild"
            component={AddChild}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen
            name="Gallery"
            component={Gallery}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportSuggestion"
            component={ReportSuggestion}
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

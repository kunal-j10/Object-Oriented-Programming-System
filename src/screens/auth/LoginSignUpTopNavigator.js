import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Login from './Login';
import SignUp from "./SignUp"
import Colors from '../../../constants/Colors';
import DefaultFontSizes from '../../../constants/DefaultFontSizes';
const Tab = createMaterialTopTabNavigator();

export default function LoginSignUpTopNavigator(){
  return (
    <Tab.Navigator
   screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: Colors.white.default,
    tabBarInactiveTintColor: Colors.grey,
    tabBarIndicatorStyle: { backgroundColor: "red",width: "46.5%",height:"100%",margin:5,borderRadius:30 },
    tabBarIndicatorContainerStyle :{padding:5},
    tabBarLabelStyle: { fontWeight: "bold",fontSize:DefaultFontSizes.mb.fontSize,textTransform:'none'},
    tabBarStyle:{borderWidth:1,borderColor:Colors.brandSecondary.dark,marginHorizontal:20,borderRadius:30,padding:5,marginTop:10},
  }}>
       <Tab.Screen
        name="Login"
        component={Login}
        options={{ tabBarLabel: "Login" }}
      />
       <Tab.Screen
        name="SignUp"
        component={SignUp}
        options={{ tabBarLabel: "Signup" }}
      />
     
   </Tab.Navigator>
  
  )
}

const styles = StyleSheet.create({})
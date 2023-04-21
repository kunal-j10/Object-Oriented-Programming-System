import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigationContainerRef } from "@react-navigation/native";

export let navigationRef;

export default function NavigationRefScreen() {
  navigationRef = useNavigationContainerRef();
  return null;
}

import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SleepHome, { SleepHomenOptions } from "./SleepHome";
import SleepPlaylist from "./SleepPlaylist";
import MusicPlayer from "../../../components/mom/sleep/MusicPlayer";
import { useSelector } from "react-redux";
import { sleepSelectedSong } from "../../../../store/sleep/selector";
import Queue, { QueueOptions } from "./Queue";
import ViewSleeps, { ViewSleepsOptions } from "./ViewSleeps";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export default function SleepStack({ navigation }) {
  const selectedSong = useSelector(sleepSelectedSong);

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="SleepHome"
          component={SleepHome}
          options={SleepHomenOptions}
        />
        <Stack.Screen
          name="SleepPlaylist"
          component={SleepPlaylist}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Queue" component={Queue} options={QueueOptions} />
        <Stack.Screen
          name="ViewSleeps"
          component={ViewSleeps}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {selectedSong && <MusicPlayer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

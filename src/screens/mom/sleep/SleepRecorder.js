import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";

import CustomHeaderButton from "../../../components/CustomHeaderButton";
import Colors from "../../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { sleepSelectedSong } from "../../../../store/sleep/selector";

const LyricsText = ({ lyrics }) => (
  <Text style={styles.lyricsText}>{lyrics}</Text>
);

export default function SleepRecorder({ navigation, route }) {
  const selectedSong = useSelector(sleepSelectedSong);

  return (
    <View style={styles.container}>
      <StatusBar animated style="dark" backgroundColor={Colors.white} />
      <LinearGradient
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.contentContainer}
        colors={[Colors.appPrimaryColor, Colors.appPrimaryLightColor]}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.lyricsTextContainer}>
            <LyricsText lyrics={selectedSong.lyrics} />
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lyricsTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lyricsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "85%",
    marginVertical: 5,
    lineHeight: 25,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 32,
    marginHorizontal: 12,
    marginBottom: 12,
    elevation: 8,
  },
});

export const SleepRecorderOptions = ({ navigation }) => {
  return {
    headerTitle: "Lyric",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#FFF",
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};

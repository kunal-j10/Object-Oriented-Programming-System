import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  Octicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Fontisto,
  Foundation,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const SectionScrollView = (props) => {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ marginVertical: 10, padding: 5 }}
      style={{
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: "#ECECEC",
        marginHorizontal: -20,
      }}
    >
      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "ActivitiesNavigator",
                params: {
                  screen: "Activities",
                },
              })
            }
          >
            <MaterialCommunityIcons name="puzzle" size={26} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.title}>Activity</Text>
      </View>
      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "AssessmentsNavigator",
                params: {
                  screen: "AssessmentCategory",
                },
              })
            }
          >
            <MaterialIcons name="chrome-reader-mode" size={26} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.title}>Assess</Text>
      </View>

      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "GrowthTrackerNavigator",
                params: {
                  screen: "GrowthTracker",
                },
              })
            }
          >
            <Octicons name="graph" size={26} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.title}>Growth</Text>
      </View>

      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "RecipesNavigator",
                params: {
                  screen: "Recipes",
                },
              })
            }
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={26}
              color="white"
            />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.title}>Recipe</Text>
      </View>

      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "SleepNavigator",
              })
            }
          >
            <Fontisto name="music-note" size={26} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.title}>Sleep</Text>
      </View>

      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "LullabyRhymesNavigator",
                params: {
                  screen: "LullabyRhymes",
                },
              })
            }
          >
            <Foundation name="play-circle" size={30} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.title}>Rhymes</Text>
      </View>

      <View style={styles.item}>
        <LinearGradient
          style={styles.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#19C190", "#F5B700"]}
        >
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MomNavigator", {
                screen: "Vaccination",
              })
            }
          >
            <FontAwesome5 name="syringe" size={26} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.title}>Vaccination</Text>
      </View>

      {/* <View
          style={{
            flexDirection: "column",
            height: 70,
            justifyContent: "space-between",
            marginHorizontal:10
          }}
        >
          <View style={styles.icon}>
            <MaterialIcons name="chrome-reader-mode" size={26} color="white" />
          </View>
          <Text style={styles.title}>Read</Text>
        </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    height: 70,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: 10,
  },
  icon: {
    padding: 10,
    backgroundColor: "#7DD915",
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#BBB3B3",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SectionScrollView;

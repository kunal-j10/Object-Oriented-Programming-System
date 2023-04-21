import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/CustomHeaderButton";
import activityIcon from "../../../assets/images/activity-mom.png";
import assessmentIcon from "../../../assets/images/Assessments.png";
import growthIcon from "../../../assets/images/GrowthTracker.png";
import lullabyIcon from "../../../assets/images/Lullabies.png";
import recipeIcon from "../../../assets/images/Recipes.png";
import fileStorageIcon from "../../../assets/images/Reports.png";
import vaccinationIcon from "../../../assets/images/Reports.png";
import sleepMusicIcon from "../../../assets/images/Sleep.png";
import momsection from "../../../assets/images/momsection.png";
import Health from "../../../assets/images/Health.png";
const momCategories = [
  {
    backgroundColor: "#E9E0F5",
    navigateScreen: "ActivitiesNavigator",
    insideNavigateScreen: "Activities",
    title: "Activities",
    icon: activityIcon,
  },
  {
    backgroundColor: "#ffa8d6",
    navigateScreen: "AssessmentsNavigator",
    insideNavigateScreen: "AssessmentCategory",
    title: "Assessments",
    icon: assessmentIcon,
  },
  {
    backgroundColor: "#E9E0F5",
    navigateScreen: "GrowthTrackerNavigator",
    insideNavigateScreen: undefined,
    title: "Growth Tracker",
    icon: growthIcon,
  },
  {
    backgroundColor: "#C6EBF1",
    navigateScreen: "HealthNavigator",
    insideNavigateScreen: undefined,
    title: "Health",
    icon: Health,
  },
  {
    backgroundColor: "#B9FED5",
    navigateScreen: "Vaccination",
    title: "Vaccination",
    icon: vaccinationIcon,
  },
  {
    backgroundColor: "#E9E0F5",
    navigateScreen: "SleepNavigator",
    insideNavigateScreen: "SleepStack",
    title: "Sleep",
    icon: sleepMusicIcon,
  },
  {
    backgroundColor: "#C6EBF1",
    navigateScreen: "LullabyRhymesNavigator",
    insideNavigateScreen: "LullabyRhymes",
    title: "Rhymes",
    icon: lullabyIcon,
  },
  // {
  //   backgroundColor: "#B9FED5",
  //   navigateScreen: "StoriesNavigator",
  //   title: "Stories",
  //   icon: growthMomIcon,
  // },

  {
    backgroundColor: "#ffa8d6",
    navigateScreen: "RecipesNavigator",
    insideNavigateScreen: "Recipes",
    title: "Recipes",
    icon: recipeIcon,
  },
  // {
  //   backgroundColor: "#B9FED5",
  //   navigateScreen: "ReportsNavigator",
  //   title: "Reports",
  //   icon: growthMomIcon,
  // },
];

export default Mom = ({ navigation }) => {
  const { height, width } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
    >
      <View
        style={{
          display: "flex",
          paddingHorizontal: 20,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            flexBasis: width < 600 ? "50%" : "40%",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Explore</Text>
          <Text style={{ fontSize: 14, marginTop: 20 }}>
            Categories for you and your child!
          </Text>
        </View>
        <Image
          source={momsection}
          style={{
            width: width < 600 ? width * 0.43 : width * 0.4,
            height: 100,
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={styles.container}>
        {momCategories.map(
          (
            {
              backgroundColor,
              navigateScreen,
              title,
              icon,
              insideNavigateScreen,
            },
            index
          ) => (
            <Pressable
              key={title}
              onPress={() => {
                if (!insideNavigateScreen) {
                  navigation.navigate(navigateScreen);
                } else {
                  navigation.navigate(navigateScreen, {
                    screen: insideNavigateScreen,
                  });
                }
              }}
              style={[
                styles.categoryContainer,
                {
                  width: width * 0.4,
                  marginHorizontal: width * 0.015,
                  marginTop: index % 2 != 0 ? 50 : null,
                },
              ]}
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.categoryTitle,
                  { textAlign: index % 2 != 0 ? "right" : null },
                ]}
              >
                {title}
              </Text>
              <View
                style={[
                  styles.categoryImageContainer,
                  { backgroundColor, elevation: 10, overflow: "hidden" },
                ]}
              >
                <Image
                  style={styles.categoryImage}
                  resizeMode="cover"
                  source={icon}
                />
              </View>
            </Pressable>
          )
        )}
      </View>
    </ScrollView>
  );
};

export const MomOptions = ({ navigation }) => {
  return {
    headerShown: "true",
    headerTitle: "Mom",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="menu"
          color="black"
          iconName="md-menu"
          onPress={() => navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingHorizontal: 13,
  },
  categoryContainer: {
    marginBottom: 32,
  },
  categoryImageContainer: {
    borderRadius: 15,
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: 180,
  },
  categoryTitle: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: "bold",
  },
});

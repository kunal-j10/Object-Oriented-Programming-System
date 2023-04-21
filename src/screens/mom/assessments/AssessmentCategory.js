import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import AssessmentCategoryCard from "../../../components/mom/assessment/AssessmentCategoryCard";
import { StatusBar } from "expo-status-bar";
const assessmentcategories = [
  {
    _id: "1",
    name: "Physical Development",
    category: "physical_development",
    localImage: require("../../../../assets/images/physical-development.png"),
    backgroundColor: "#FFA8D6",
    textColor: "#A80059",
  },
  {
    _id: "2",
    name: "Social & Emotional Development",
    category: "social_n_emotional_development",
    localImage: require("../../../../assets/images/social-emotioal-development.png"),
    backgroundColor: "#E9E0F5",
    textColor: "#4E297F",
  },
  {
    _id: "3",
    name: "Cognitive Development",
    category: "cognitive_development",
    localImage: require("../../../../assets/images/cognitive-development.png"),
    backgroundColor: "#C6EBF1",
    textColor: "#217987",
  },
  {
    _id: "4",
    name: "Linguistic Development",
    category: "language_development",
    localImage: require("../../../../assets/images/language-development.png"),
    backgroundColor: "#B9FED5",
    textColor: "#02A645",
  },
];

export default function AssessmentCategory({ navigation }) {
  const keyExtractor = useCallback((item) => item._id, []);

  const navigateHandler = useCallback((category, categoryName) => {
    navigation.navigate("Assessments", { category, categoryName });
  }, []);

  const RenderItem = useCallback(
    ({ item }) => (
      <AssessmentCategoryCard
        name={item.name}
        category={item.category}
        imageSrc={item.localImage}
        backgroundColor={item.backgroundColor}
        textColor={item.textColor}
        navigateHandler={navigateHandler}
      />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={assessmentcategories}
        keyExtractor={keyExtractor}
        renderItem={RenderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export const AssessmentCategoryOptions = ({ navigation }) => {
  return {
    headerTitle: "Assessment",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
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

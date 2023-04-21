import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { selectedChildAgeinMonths } from "../../../../store/auth/selector";
import CustomHeaderButton from "../../../components/CustomHeaderButton";
import Skelleton from "../../../components/loader/SkeletonLoader";
import ActivityCard from "../../../components/mom/activity/ActivityCard";
import {
  activitySelector,
  activityLoadingSelector,
  activityListErrorSelector,
} from "../../../../store/activity/selector";
import { activityFetch } from "../../../../store/activity/operation";
import { useCallback } from "react";
import { removeNoInternetAction } from "../../../../store/auth/slice";
import { StatusBar } from "expo-status-bar";
const categories = [
  { key: "0", category: "physical_development", displayCategory: "Physical" },
  { key: "1", category: "cognitive_development", displayCategory: "Cognitive" },
  {
    key: "2",
    category: "social_n_emotional_development",
    displayCategory: "Social And Emotional",
  },
  { key: "3", category: "language_development", displayCategory: "Linguistic" },
];

const DEVICE_HEIGHT = Dimensions.get("window").height;

export default function Activities(props) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("physical_development");
  const ActivityData = useSelector(activitySelector);
  const IsLoading = useSelector(activityLoadingSelector);
  const activityError = useSelector(activityListErrorSelector);
  const childCurrentAge = useSelector(selectedChildAgeinMonths);
  const [monthnumber, setmonthnumber] = useState(childCurrentAge ? childCurrentAge:null);

  const monthToYear = () => {
    if(!monthnumber){
      return null;
    }
    var age = monthnumber / 12;
    let Years = Math.trunc(age);
    let months = monthnumber % 12;
    if (Years == 0 && months == 1) {
      return months + " month";
    } else if (Years == 0) {
      return months + " months";
    } else if (months == 0 && Years == 1) {
      return Years + " year";
    } else if (months == 0) {
      return Years + " years";
    } else if (months == 1 && Years == 1) {
      return Years + " year " + months + " month";
    } else if (Years != 1 && months == 1) {
      return Years + " years " + months + " month";
    } else {
      return Years + " years " + months + " months";
    }
  };
  useEffect(() => {
    return () => {
      dispatch(removeNoInternetAction(activityFetch.type));
    };
  }, []);

  useEffect(() => {
    dispatch(activityFetch({ category, ageInMonths: monthnumber }));
    monthToYear();
  }, [dispatch, category, monthnumber]);

  const EmptyList = useMemo(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>
          {activityError === "" ? "No Activities found!" : activityError}
        </Text>
      </View>
    ),
    [activityError]
  );

  const activitiesKeyExtractor = useCallback(({ _id }) => _id, []);

  const renderItem = ({ item }) => (
    <ActivityCard
      status={item.status}
      agegroup={item.agegroup}
      thumbnailUrl={item.thumbnailUrl}
      title={item.title}
      views={item.no_of_views}
      duration={item.duration}
      onClickActivity={() => {
        props.navigation.navigate("ActivityContent", {
          selectedActivityId: item._id,
          category: category,
          headerTitle: item.title,
        });
      }}
    />
  );

  const renderCategoryItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={{
          borderBottomColor:
            category == item.category ? "black" : "rgba(196, 196, 196, 0.4)",
          borderBottomWidth: 2,
        }}
        onPress={() => setCategory(item.category)}
      >
        <Text
          style={[
            styles.categoryTitle,
            {
              color:
                category === item.category ? "black" : "rgba(24, 20, 31, 0.6)",
            },
          ]}
        >
          {item.displayCategory}
        </Text>
      </TouchableOpacity>
    ),
    [category]
  );

  return (
    <View style={styles.container}>
      {/* SECTION */}
      <StatusBar style="auto" backgroundColor="#03B44D" />
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.categories}
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryItem}
        />
      </View>

      {/* CALENDAR */}

      {childCurrentAge && <View style={styles.calender}>
        <TouchableOpacity
          onPress={() => {
            if (monthnumber <= 1) {
              setmonthnumber(1);
            } else {
              setmonthnumber(monthnumber - 1);
            }
          }}
        >
          <AntDesign
            name="left"
            size={DEVICE_HEIGHT > 600 ? 20 : 16}
            color="#18141F"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: DEVICE_HEIGHT > 600 ? 14 : 12,
            color: "rgba(22, 43, 66, 0.6)",
          }}
        >
          {monthToYear()}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setmonthnumber(monthnumber + 1);
          }}
        >
          <AntDesign
            name="right"
            size={DEVICE_HEIGHT > 600 ? 20 : 16}
            color="#18141F"
          />
        </TouchableOpacity>
      </View>}
      {/* CALENDAR */}
      {IsLoading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.activities}
          data={ActivityData}
          keyExtractor={activitiesKeyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={EmptyList}
        />
      )}
    </View>
  );
}

export const ActivitiesOptions = ({ navigation }) => {
  return {
    headerTitle: "Activities",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  categories: {
    paddingTop: 10,
  },
  categoryTitle: {
    paddingHorizontal: DEVICE_HEIGHT > 600 ? 18 : 10,
    fontSize: DEVICE_HEIGHT > 600 ? 15 : 14,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  calender: {
    paddingVertical: DEVICE_HEIGHT > 600 ? 18 : 8,
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  activities: {
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundTxt: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});

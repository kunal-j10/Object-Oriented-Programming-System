import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import {
  assessmentErrorSelector,
  assessmentListErrorSelector,
  assessmentLoadingSelector,
  assessmentSelector,
} from "../../../../store/assessment/selector";
import Skelleton from "../../../components/loader/SkeletonLoader";
import {
  assessmentFetch,
  changeStatus,
  assessmentRemoveError,
} from "../../../../store/assessment/operation";

import CustomHeaderButton from "../../../components/CustomHeaderButton";
import AssessmentCard from "../../../components/mom/assessment/AssessmentCard";
import Colors from "../../../../constants/Colors";
import { removeNoInternetAction } from "../../../../store/auth/operation";
import Toast from "react-native-root-toast";

const windowWidth = Dimensions.get("window").width;

export default function Assessments({ navigation, route }) {
  // getting assessment category from route
  const { category } = route.params;

  // getting data from store
  const assessmentData = useSelector(assessmentSelector);
  const isLoading = useSelector(assessmentLoadingSelector);
  const assessmentError = useSelector(assessmentListErrorSelector);
  const error = useSelector(assessmentErrorSelector);

  const dispatch = useDispatch();

  // fetching all assssments for given category
  useEffect(() => {
    dispatch(assessmentFetch(category));

    return () => {
      dispatch(removeNoInternetAction(assessmentFetch.type));
    };
  }, []);

  // displaying errors if occured
  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(assessmentRemoveError());
        },
      });
    }
  }, [error]);

  // displaying when no assessnents is found with the assessmentError message
  const EmptyList = useMemo(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>
          {assessmentError === "" ? "No Assessments found!" : assessmentError}
        </Text>
      </View>
    ),
    [assessmentError]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  const RenderItem = useCallback(
    ({ item }) => (
      <AssessmentCard
        question={item.question}
        status={item.status}
        no_of_attendies={item.no_of_attendies}
        onQuestionPress={() =>
          navigation.navigate("AssessmentDetail", { id: item._id })
        }
        onMarkCompletePress={() =>
          dispatch(changeStatus({ id: item._id, status: "completed" }))
        }
      />
    ),
    [navigation?.navigate]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {isLoading ? (
        <View style={{ alignItems: "center" }}>
          <Skelleton />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          data={assessmentData}
          keyExtractor={keyExtractor}
          renderItem={RenderItem}
          ListEmptyComponent={EmptyList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 8,
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

// setting header for assessments screen
export const AssessmentsOptions = ({ route, navigation }) => {
  return {
    headerTitle: () => (
      <Text
        style={{ fontSize: 20, maxWidth: windowWidth * 0.65 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {route.params.categoryName}
      </Text>
    ),
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
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    //     <Item
    //       title="search"
    //       color="black"
    //       iconName="search"
    //       onPress={() => {}}
    //     />
    //   </HeaderButtons>
    // ),
  };
};

import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import CustomHeaderButton from "../../../components/CustomHeaderButton";
import Skelleton from "../../../components/loader/SkeletonLoader";
import RecipeCard from "../../../components/mom/growth/recipe/RecipeCard";
import {
  recipeErrorListSelector,
  recipeLoadingSelector,
  recipeRefreshingSelector,
  recipesSelector,
} from "../../../../store/recipe/selector";
import { recipeFetch } from "../../../../store/recipe/operation";
import { removeNoInternetAction } from "../../../../store/auth/operation";

export default function Recipes(props) {
  const { navigation } = props;

  const { width } = useWindowDimensions();

  const loading = useSelector(recipeLoadingSelector);
  const refreshing = useSelector(recipeRefreshingSelector);
  const errorList = useSelector(recipeErrorListSelector);
  const recipes = useSelector(recipesSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recipeFetch("loading"));

    return () => {
      dispatch(removeNoInternetAction(recipeFetch.type));
    };
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(recipeFetch("refreshing"));
  }, []);

  const EmptyList = useCallback(
    () => (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTxt}>{errorList}</Text>
      </View>
    ),
    [errorList]
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Skelleton />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar style="auto" />
      {recipes.length === 0 ? (
        <EmptyList />
      ) : (
        <View style={styles.recipeList}>
          {recipes.map(({ _id, title, thumbnail }) => (
            <RecipeCard
              key={_id}
              title={title}
              thumbnail={thumbnail}
              width={width * 0.43}
              onPress={() =>
                navigation.navigate("RecipeDetail", { recipeId: _id })
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
  recipeList: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 15,
  },
});

export const RecipesOptions = ({ navigation }) => {
  return {
    headerTitle: "Recipes",
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

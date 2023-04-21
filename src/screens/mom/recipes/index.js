import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Recipes, { RecipesOptions } from "./Recipes";
import RecipeDetail, { RecipeDetailOptions } from "./RecipeDetail";

const Stack = createStackNavigator();

export default function RecipesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Recipes"
        component={Recipes}
        options={RecipesOptions}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetail}
        options={RecipeDetailOptions}
      />
    </Stack.Navigator>
  );
}

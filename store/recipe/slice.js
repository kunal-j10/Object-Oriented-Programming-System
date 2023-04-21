import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  refreshing: false,
  errorList: "",
  error: "",
  recipes: [],
  recipeDetail: null,
  recommendedRecipes: [],
  recommendedRecipesLoader: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    recipeFetch(state, { payload: type }) {
      if (type === "loading") {
        state.loading = true;
      } else if (type === "refreshing") {
        state.refreshing = true;
      }
    },
    recipeFetchSuccess(state, { payload }) {
      state.loading = false;
      state.refreshing = false;
      state.recipes = payload;
    },
    recipeFetchFail(state, { payload }) {
      state.loading = false;
      state.refreshing = false;
      state.errorList = payload;
    },
    recipeDetailFetch(state) {
      state.loading = true;
    },
    recipeDetailFetchSuccess(state, { payload }) {
      state.loading = false;
      state.recipeDetail = payload;
    },
    recipeDetailFetchFail(state, { payload }) {
      state.loading = false;
      state.error = payload;
    },
    recipeRemoveError(state) {
      state.error = "";
    },
    recommendedRecipesfetch(state) {
      state.recommendedRecipesLoader = true;
    },
    recommendedRecipeSuccess(state, { payload }) {
      state.recommendedRecipes = payload;
      state.recommendedRecipesLoader = false;
    },
    recommendedRecipeFailure(state, { payload }) {
      state.recommendedRecipesLoader = false;
    },
  },
});

export const {
  recipeFetch,
  recipeFetchSuccess,
  recipeFetchFail,
  recipeDetailFetch,
  recipeDetailFetchSuccess,
  recipeDetailFetchFail,
  recipeRemoveError,
  recommendedRecipesfetch,
  recommendedRecipeSuccess,
  recommendedRecipeFailure
} = recipeSlice.actions;

export default recipeSlice.reducer;

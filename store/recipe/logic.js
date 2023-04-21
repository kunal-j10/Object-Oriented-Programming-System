import get from "lodash/get";
import { createLogic } from "redux-logic";
import crashlytics from "@react-native-firebase/crashlytics";
import NetInfo from "@react-native-community/netinfo";

import { addNoInternetAction } from "../auth/slice";
import {
  recipeDetailFetch,
  recipeDetailFetchFail,
  recipeDetailFetchSuccess,
  recipeFetch,
  recipeFetchFail,
  recipeFetchSuccess,
  recipeDetailFetchFailure,
  recommendedRecipesfetch,
  recommendedRecipeSuccess,
  recommendedRecipeFailure
} from "./slice";

const recipeFetchLogic = createLogic({
  type: recipeFetch.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch list of recipes (endpoint: /recipe/getRecipes) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/recipe/getRecipes", {
        params: { dob: activechildDetails?.dob },
      });

      dispatch(recipeFetchSuccess(res.data.data));
      } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        recipeFetchFail(get(err, "response.data.error.message", err.message))
      );

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: recipeFetch.type,
            payload: "loading"
          })
        );
      }
    }
    done();
  },
});

const recipeDetailFetchLogic = createLogic({
  type: recipeDetailFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch data of specific recipe (endpoint: /recipe/getRecipes) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        recipe: { recipes },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const recipeId = action.payload;

      let recipeDetail = recipes.find((item) => item._id === recipeId);

      // raising network error if the recipe is already present to avoid error in youtube player
      if (recipeDetail) {
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable === false) {
          throw new Error(networkError);
        }
      }

      // fetching recipe data if not present
      if (!recipeDetail) {
        const res = await momAxios.get("/recipe/getRecipes", {
          params: { recipeId },
        });

        recipeDetail = res.data.data[0];
      }

      dispatch(recipeDetailFetchSuccess(recipeDetail));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        recipeDetailFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: recipeDetailFetch.type,
            payload: action.payload,
          })
        );
      }
    }
    done();
  },
});

const recommendedRecipesfetchLogic = createLogic({
  type: recommendedRecipesfetch.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching recommended recipes in home screen (endpoint: /recipe/getRecipes) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/recipe/getRecipes");

      dispatch(recommendedRecipeSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: recommendedRecipesfetch.type,
          })
        );
      }

      dispatch(
        recommendedRecipeFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});
export default [recipeFetchLogic, recipeDetailFetchLogic,recommendedRecipesfetchLogic];

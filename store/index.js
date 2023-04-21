import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createLogicMiddleware } from "redux-logic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

import {
  authAxios,
  momAxios,
  communityAxios,
  mediaAxios,
} from "../src/services/axios";

import DefaultConfig from "../constants/config.json";

import authLogics from "./auth/logic";
import authReducer from "./auth/slice";

import authBlacklistReducer from "./authBlacklist/slice";

import communityLogics from "../store/community/logic";
import communityReducer from "../store/community/slice";

import kidLogics from "./kid/logic";
import kidReducer from "./kid/slice";

import assessmentLogics from "../store/assessment/logic";
import assessmentReducer from "../store/assessment/slice";

import rhymesLogics from "./rhymes/logic";
import rhymesReducer from "./rhymes/slice";

import activityLogics from "./activity/logic";
import activityReducer from "./activity/slice";

import vaccinationLogics from "./vaccination/logic";
import vaccinationReducer from "./vaccination/slice";

import healthLogics from "./health/logic";
import healthReducer from "./health/slice";

import homeLogics from "./home/logic";
import homeReducer from "./home/slice";

import myProfileLogics from "./myProfile/logic";
import myProfileReducer from "./myProfile/slice";

import growthLogics from "./growth/logic";
import growthReducer from "./growth/slice";

import dynamicLinkLogics from "./dynamicLinks/logic";
import dynamicLinkReducer from "./dynamicLinks/slice";

import recipeLogics from "./recipe/logic";
import recipeReducer from "./recipe/slice";

import sleepLogics from "./sleep/logic";
import sleepReducer from "./sleep/slice";

import sideDrawerLogics from "./sideDrawer/logic";
import sideDrawerReducer from "./sideDrawer/slice";

import parentProfileLogics from "./parentProfile/logic";
import parentProfileReducer from "./parentProfile/slice";

import themeReducer from "./theme/slice";

const deps = {
  authAxios,
  momAxios,
  communityAxios,
  mediaAxios,
  networkError: DefaultConfig.network_error_message,
};

const logicArr = [
  ...authLogics,
  ...communityLogics,
  ...kidLogics,
  ...assessmentLogics,
  ...rhymesLogics,
  ...activityLogics,
  ...vaccinationLogics,
  ...healthLogics,
  ...homeLogics,
  ...dynamicLinkLogics,
  ...myProfileLogics,
  ...growthLogics,
  ...recipeLogics,
  ...sleepLogics,
  ...sideDrawerLogics,
  ...parentProfileLogics,
];

const logicMiddleware = createLogicMiddleware(logicArr, deps);

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  authBlacklist: authBlacklistReducer,
  community: communityReducer,
  kid: kidReducer,
  assessment: assessmentReducer,
  rhymes: rhymesReducer,
  activity: activityReducer,
  vaccination: vaccinationReducer,
  health: healthReducer,
  home: homeReducer,
  dynamic: dynamicLinkReducer,
  myProfile: myProfileReducer,
  growth: growthReducer,
  recipe: recipeReducer,
  sleep: sleepReducer,
  sideDrawer: sideDrawerReducer,
  parentProfile: parentProfileReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default store = configureStore({
  reducer: persistedReducer,
  middleware: [logicMiddleware],
  devTools: true,
});

export const persistor = persistStore(store);

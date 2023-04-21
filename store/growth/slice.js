import { createSlice } from "@reduxjs/toolkit";

import { transformGraphData } from "../../src/utils/growth";

const initialState = {
  loadingWeight: false,
  loadingHeight: false,
  loadingHead: false,
  refreshingWeight: false,
  refreshingHeight: false,
  refreshingHead: false,
  error: "",
  errorWeight: "",
  errorHeight: "",
  errorHead: "",
  graphWeight: null,
  graphHeight: null,
  graphHead: null,
  measurementWeightData: [],
  measurementHeightData: [],
  measurementHeadData: [],
  dataUploaded: false,
};

const growthSlice = createSlice({
  name: "growth",
  initialState,
  reducers: {
    growthWeightFetch(state, { payload: type }) {
      if (type === "loading") {
        state.loadingWeight = true;
      } else if (type === "refreshing") {
        state.refreshingWeight = true;
      }
    },
    growthHeightFetch(state, { payload: type }) {
      if (type === "loading") {
        state.loadingHeight = true;
      } else if (type === "refreshing") {
        state.refreshingHeight = true;
      }
    },
    growthHeadFetch(state, { payload: type }) {
      if (type === "loading") {
        state.loadingHead = true;
      } else if (type === "refreshing") {
        state.refreshingHead = true;
      }
    },
    growthWeightFetchSuccess(state, { payload }) {
      const { standardData, userData, userDataForGraph } = payload;
      state.loadingWeight = false;
      state.refreshingWeight = false;

      state.graphWeight = {
        labels: standardData.ageInMonths_list,
        datasets: transformGraphData(standardData, userDataForGraph, "weight"),
      };
      state.measurementWeightData = userData;
    },
    growthWeightFetchFail(state, { payload: error }) {
      state.loadingWeight = false;
      state.refreshingWeight = false;
      state.errorWeight = error;
    },
    growthHeightFetchSuccess(state, { payload }) {
      const { standardData, userData, userDataForGraph } = payload;
      state.loadingHeight = false;
      state.refreshingHeight = false;

      state.graphHeight = {
        labels: standardData.ageInMonths_list,
        datasets: transformGraphData(standardData, userDataForGraph, "height"),
      };
      state.measurementHeightData = userData;
    },
    growthHeightFetchFail(state, { payload: error }) {
      state.loadingHeight = false;
      state.refreshingHeight = false;
      state.errorHeight = error;
    },
    growthHeadFetchSuccess(state, { payload }) {
      const { standardData, userData, userDataForGraph } = payload;
      state.loadingHead = false;
      state.refreshingHead = false;

      state.graphHead = {
        labels: standardData.ageInMonths_list,
        datasets: transformGraphData(
          standardData,
          userDataForGraph,
          "headCircle"
        ),
      };
      state.measurementHeadData = userData;
    },
    growthHeadFetchFail(state, { payload: error }) {
      state.loadingHead = false;
      state.refreshingHead = false;
      state.errorHead = error;
    },
    growthAddDetails() {},
    growthAddDetailsSuccess(state) {
      state.dataUploaded = true;
    },
    growthAddDetailsFail(state, { payload: error }) {
      state.dataUploaded = false;
      state.error = error;
    },
    growthChangeDataUploaded(state) {
      state.dataUploaded = false;
    },
    growthRemoveError(state) {
      state.error = "";
    },
    growthRemoveWeightError(state) {
      state.errorWeight = "";
    },
    growthRemoveHeightError(state) {
      state.errorHeight = "";
    },
    growthRemoveHeadError(state) {
      state.errorHead = "";
    },
  },
});

export const {
  growthWeightFetch,
  growthHeightFetch,
  growthHeadFetch,
  growthWeightFetchSuccess,
  growthHeightFetchSuccess,
  growthHeadFetchSuccess,
  growthWeightFetchFail,
  growthHeightFetchFail,
  growthHeadFetchFail,
  growthAddDetails,
  growthAddDetailsSuccess,
  growthAddDetailsFail,
  growthChangeDataUploaded,
  growthRemoveError,
  growthRemoveWeightError,
  growthRemoveHeightError,
  growthRemoveHeadError,
} = growthSlice.actions;

export default growthSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vaccines: [],
  homeVaccines: [],
  isLoading: false,
  isRefreshing: false,
  isUploading: false,
  isUploaded: false,
  errorDisplay: "",
  error: "",
};

export const vaccinationSlice = createSlice({
  name: "vaccination",
  initialState,
  reducers: {
    vaccineFetch(state, { payload: { status } }) {
      if (status === "loading") {
        state.isLoading = true;
      } else if (status === "refreshing") {
        state.isRefreshing = true;
      }
    },
    vaccineFetchSuccess(state, { payload }) {
      if (payload.isHomeScreen) {
        state.homeVaccines = payload.data;
      } else {
        state.vaccines = payload.data;
      }

      state.isLoading = false;
      state.isRefreshing = false;
    },
    vaccineFetchFail(state, { payload }) {
      if (payload.isHomeScreen) {
        state.error = payload.error;
      } else {
        state.errorDisplay = payload.error;
      }

      state.vaccines = [];
      state.isLoading = false;
      state.isRefreshing = false;
    },
    vaccineStore(state) {
      state.isUploading = true;
    },
    vaccineStoreSuccess(state) {
      state.isUploading = false;
      state.isUploaded = true;
    },
    vaccineStoreFail(state, { payload }) {
      state.isUploading = false;
      state.isUploaded = false;
      state.error = payload;
    },
    vaccineChangeIsUploaded(state) {
      state.isUploaded = false;
    },
    vaccineRemoveError(state) {
      state.error = "";
    },
  },
});

export const {
  vaccineFetch,
  vaccineFetchSuccess,
  vaccineFetchFail,
  vaccineStore,
  vaccineStoreSuccess,
  vaccineStoreFail,
  vaccineChangeIsUploaded,
  vaccineRemoveError,
} = vaccinationSlice.actions;

export default vaccinationSlice.reducer;

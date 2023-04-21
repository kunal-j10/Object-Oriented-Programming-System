import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parentProfilePicLoading: false,
  childProfilePicLoading: false,
  parentEditLoading: false,
  childEditLoading: false,
  parentPasswordChnageLoading: false,
  childProfilePicLoading: null,
  successMessage:"",
  error: "",
  myProfileSection: "my_profile",
};

export const myProfileSlice = createSlice({
  name: "myProfile",
  initialState,
  reducers: {
    parentProfilePicFetch(state) {
      state.parentProfilePicLoading = false;
    },
    parentProfilePicFetchSuccess(state) {
      state.parentProfilePicLoading = true;
    },
    parentProfilePicFetchFailure(state, { payload }) {
      (state.parentProfilePicLoading = false), (state.error = payload);
    },
    childProfilePicFetch(state) {
      state.childProfilePicLoading = false;
    },
    childProfilePicFetchSuccess(state) {
      state.childProfilePicLoading = true;
    },
    childProfilePicFetchFailure(state, { payload }) {
      (state.childProfilePicLoading = false), (state.error = payload);
    },
    parentEditFetch(state) {
      state.parentEditLoading = true;
    },
    parentEditFetchSuccess(state,{payload}) {
      state.parentEditLoading = false;
      state.successMessage = payload.message;
    },
    parentEditFetchFailure(state, { payload }) {
      (state.parentEditLoading = false), (state.error = payload);
    },
    parentEditPasswordFetch(state) {
      state.parentPasswordChnageLoading = false;
    },
    parentEditPasswordSuccess(state) {
      state.parentPasswordChnageLoading = false;
    },
    parentEditPasswordFailure(state, { payload }) {
      state.parentPasswordChnageLoading = true;
      state.error = payload;
    },
    childEditFetch(state) {
      state.parentEditLoading = true;
    },
    childEditFetchSuccess(state,{payload}) {
      state.parentEditLoading = false;
      state.successMessage = payload.message;
    },
    childEditFetchFailure(state, { payload }) {
      (state.parentEditLoading = false), (state.error = payload);
    },
    profileSectionFetch() {},
    profileSectionChange(state, { payload }) {
      state.myProfileSection = payload;
    },
    removeSuccessMessage(state){
      state.successMessage = "";
    },
    removeErrorMessage(state){
      state.error = "";
    }
  },
});

export const {
  parentProfilePicFetch,
  parentProfilePicFetchSuccess,
  parentProfilePicFetchFailure,
  parentEditFetch,
  parentEditFetchSuccess,
  parentEditFetchFailure,
  parentEditPasswordFetch,
  parentEditPasswordSuccess,
  parentEditPasswordFailure,
  childEditFetch,
  childEditFetchSuccess,
  childEditFetchFailure,
  profileSectionFetch,
  profileSectionChange,
  childProfilePicFetch,
  childProfilePicFetchSuccess,
  childProfilePicFetchFailure,
  removeSuccessMessage,
  removeErrorMessage
} = myProfileSlice.actions;

export default myProfileSlice.reducer;

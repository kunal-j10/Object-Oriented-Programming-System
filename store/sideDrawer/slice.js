import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FAqs: [],
  FAqLoading: null,
  ContactUsRes: "",
  ContactUsResLoading: null,
  FeedBackRes: "",
  FeedBackResLoading: null,
};

export const sideDrawerSlice = createSlice({
  name: "sideDrawer",
  initialState,
  reducers: {
    fetchFAqs(state) {
      state.FAqLoading = true;
    },
    fetchFAqsSuccess(state, { payload }) {
      state.FAqs = payload;
      state.FAqLoading = false;
    },
    fetchFAqsFailure(state, { payload }) {
      state.FAqs = payload;
      state.FAqLoading = false;
    },
    fetchContactUsDetails(state) {
      state.ContactUsResLoading = true;
    },
    fetchContactUsDetailsSuccess(state, { payload }) {
      (state.ContactUsRes = payload), (state.ContactUsResLoading = false);
    },
    fetchContactUsDetailsFailure(state, { payload }) {
      (state.ContactUsRes = payload), (state.ContactUsResLoading = false);
    },
    fetchFeedbackDetails(state) {
      state.FeedBackResLoading = false;
    },
    fetchFeedbackDetailsSuccess(state, { payload }) {
      (state.FeedBackRes = payload), (state.FeedBackResLoading = false);
    },
    fetchFeedbackDetailsFailure(state, { payload }) {
      (state.FeedBackRes = payload), (state.FeedBackResLoading = false);
    },
  },
});

export const {
  fetchFAqs,
  fetchFAqsSuccess,
  fetchFAqsFailure,
  fetchContactUsDetails,
  fetchContactUsDetailsSuccess,
  fetchContactUsDetailsFailure,
  fetchFeedbackDetails,
  fetchFeedbackDetailsSuccess,
  fetchFeedbackDetailsFailure,
} = sideDrawerSlice.actions;

export default sideDrawerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessments: [],
  assessmentLoading: true,
  assessmentError: "",
  error: "",
  assessmentDetail: null,
};

export const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    assessmentFetch(state) {
      state.assessmentLoading = true;
      state.assessmentError = "";
    },
    assessmentFetchSuccess(state, { payload }) {
      state.assessments = payload;
      state.assessmentLoading = false;
    },
    assessmentFetchFail(state, { payload }) {
      state.assessments = [];
      state.assessmentLoading = false;
      state.assessmentError = payload;
    },
    changeStatus() {},
    changeStatusSuccess(state, { payload }) {
      const { id, status, note } = payload;
      const assessment = state.assessments.find((item) => item._id === id);

      if (assessment) {
        assessment.status = status;
      }
      if (state.assessmentDetail?._id === id) {
        state.assessmentDetail.status = status;
        if (note) {
          state.assessmentDetail.note = note;
        }
      }
    },
    changeStatusFail(state, { payload }) {
      state.error = payload;
    },
    assessmentDetailFetch() {},
    assessmentDetailFetchSuccess(state, { payload }) {
      state.assessmentDetail = payload;
    },
    assessmentDetailFetchFail(state, { payload }) {
      state.assessmentDetail = null;
      state.error = payload;
    },
    assessmentRemoveError(state) {
      state.error = "";
    },
  },
});

export const {
  assessmentFetch,
  assessmentFetchSuccess,
  assessmentFetchFail,
  changeStatus,
  changeStatusSuccess,
  changeStatusFail,
  assessmentDetailFetch,
  assessmentDetailFetchSuccess,
  assessmentDetailFetchFail,
  assessmentRemoveError,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;

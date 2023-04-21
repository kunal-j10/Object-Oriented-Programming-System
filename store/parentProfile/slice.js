import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isProfileLoading: null,
  contentLoading: null,
  error: "",
  content: [],
  parentProfileDetails: {},
  parentBlockReportLoading: false,
  parentBlockReportStatus: "",
};

export const parentProfileSlice = createSlice({
  name: "parentProfile",
  initialState,
  reducers: {
    parentprofileDetailsfecth(state) {
      state.isProfileLoading = true;
    },
    parentprofileDetailsfecthSuccess(state, { payload }) {
      state.parentProfileDetails = payload;
      state.isProfileLoading = false;
    },
    parentprofileDetailsfecthFailure(state, { payload }) {
      state.error = payload;
      state.isProfileLoading = false;
    },
    contentfetch(state) {
      state.contentLoading = true;
    },
    contentfetchSuccess(state, { payload }) {
      if (payload.count == 0) {
        let arr = [];
        arr.push(payload);
        state.content = arr;
      } else {
        state.content = [];
        state.content = payload.data;
      }
      state.contentLoading = false;
    },
    contentfetchFailure(state, { payload }) {
      state.error = payload;
      state.contentLoading = false;
    },
    parentReportBlockfetch(state){
      state.parentBlockReportLoading = true
    },
    parentReportBlockfetchSuccess(state,{payload}){
      state.parentBlockReportLoading = false,
      state.parentBlockReportStatus = payload
    },
    parentReportBlockfetchFailure(state,{payload}){
      state.parentBlockReportLoading = false,
      state.parentBlockReportStatus = payload
    },
    emptyReportBlockStatus(){},
    emptyReportBlockStatusSuccess(state){
      state.parentBlockReportStatus = ""
    },
    emptyReportBlockStatusFailure(state){
      state.parentBlockReportStatus = ""
    }
  },
});

export const {
  parentprofileDetailsfecth,
  parentprofileDetailsfecthSuccess,
  parentprofileDetailsfecthFailure,
  contentfetch,
  contentfetchSuccess,
  contentfetchFailure,
  parentReportBlockfetch,
  parentReportBlockfetchSuccess,
  parentReportBlockfetchFailure,
  emptyReportBlockStatus,
  emptyReportBlockStatusSuccess,
  emptyReportBlockStatusFailure
} = parentProfileSlice.actions;

export default parentProfileSlice.reducer;

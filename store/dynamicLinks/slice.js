import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dynamicLink: " ",
  dynamicLinkLoader: null,
  screen: " ",
};

export const dynamicSlice = createSlice({
  name: "dynamic",
  initialState,
  reducers: {
    dynamicLinkFetch(state) {
      state.dynamicLinkLoader = true;
    
    },
    dynamicLinkFetchSuccess(state, { payload }) {
     state.screen = payload.screen
      state.dynamicLink = payload.link;
      state.dynamicLinkLoader = false;
    },
    dynamicLinkFetchFailure(state) {
      (state.dynamicLinkLoader = false), (state.dynamicLink = "");
    },
  },
});

export const {
  dynamicLinkFetch,
  dynamicLinkFetchSuccess,
  dynamicLinkFetchFailure,
} = dynamicSlice.actions;

export default dynamicSlice.reducer;

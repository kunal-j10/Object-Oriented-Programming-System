import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialLoading: true,
  isInternetReachable: true,
};

const authBlacklistSLice = createSlice({
  name: "authBlacklist",
  initialState,
  reducers: {
    authBlacklistInitialLoading(state, { payload }) {
      state.initialLoading = payload;
    },
    authBlacklistChangeInternetReachable(state, { payload }) {
      state.isInternetReachable = payload;
    },
  },
});

export const {
  authBlacklistInitialLoading,
  authBlacklistChangeInternetReachable,
} = authBlacklistSLice.actions;

export default authBlacklistSLice.reducer;

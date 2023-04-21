import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recommendedHomeSlider: [],
  recommendedHomeSliderLoading: null,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    homeSliderfetch(state) {
      state.recommendedHomeSliderLoading = true;
    },
    homeSliderfetchSuccess(state, { payload }) {
      state.recommendedHomeSlider = payload;
      state.recommendedHomeSliderLoading = false;
    },
    homeSliderfetchFailure(state, { payload }) {
      state.recommendedHomeSliderLoading = false;
    },
  },
});

export const {
  homeSliderfetch,
  homeSliderfetchSuccess,
  homeSliderfetchFailure,
} = homeSlice.actions;

export default homeSlice.reducer;

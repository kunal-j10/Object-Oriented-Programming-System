import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  sliderLoading: false,
  kidscreen1Loading: false,
  kidscreen2Loading: false,
  kidscreen3Loading: true,
  listLoading: false,
  videos: [],
  videoDetail: null,
  recommendVideos: [],
  homeRecommendVideos: [],
  LastUpdatedId: null,
  postReachedTillEnd: false,
  recommendedSliderVideos: [],
  kidError: "",
  listError: "",
};

export const kidSlice = createSlice({
  name: "kid",
  initialState,
  reducers: {
    sliderImageFetch(state) {
      state.sliderLoading = true;
    },
    sliderImagesFetchSuccess(state, { payload }) {
      state.recommendedSliderVideos = payload;
      state.sliderLoading = false;
    },
    sliderImagesFetchFailure(state, { payload }) {
      state.recommendedSliderVideos = [];
      state.kidError = payload;
      state.sliderLoading = true;
    },
    categoryFetch(state) {
      state.kidscreen1Loading = true;
    },
    categoryFetchSuccess(state, { payload }) {
      state.categories = payload;
      state.kidscreen1Loading = false;
    },
    categoryFetchFailure(state, { payload }) {
      state.kidscreen1Loading = false;
      state.kidError = payload;
    },
    specificCategoryFetch(state) {
      state.kidscreen2Loading = true;
    },
    specificCategoryFetchSuccess(state, { payload }) {
      if (!payload.postReachedTillEnd) {
        state.videos = payload.kidcategoryVideos;
        state.LastUpdatedId = payload.LastUpdatedId;
        state.postReachedTillEnd = payload.postReachedTillEnd;
      } else {
        postReachedTillEnd = payload.postReachedTillEnd;
      }
      state.kidscreen2Loading = false;
    },
    specificCategoryFetchFailure(state, { payload }) {
      state.kidError = payload;
      state.kidscreen2Loading = false;
    },
    extraVideosFetch() {},
    extraVideosFetchSuccess(state, { payload }) {
      if (!payload.postReachedTillEnd) {
        let updateVideosList = [...state.videos, ...payload.kidcategoryVideos];
        state.videos = updateVideosList;
        state.LastUpdatedId = payload.LastUpdatedId;
        state.postReachedTillEnd = payload.postReachedTillEnd;
      } else {
        state.postReachedTillEnd = payload.postReachedTillEnd;
      }
    },
    extraVideosFetchFailure(state, { payload }) {
      state.kidError = payload;
    },
    videoDetailFetch(state) {
      state.kidscreen3Loading = true;
    },
    videoDetailFetchSuccess(state, { payload }) {
      state.kidscreen3Loading = false;
      state.videoDetail = payload;
    },
    videoDetailFetchFail(state, { payload }) {
      state.kidscreen3Loading = false;
      state.kidError = payload;
      state.videoDetail = null;
    },
    removeVideoDetail(state) {
      state.videoDetail = null;
      state.recommendVideos = [];
    },
    recommendedVideoFetch(state) {
      state.listLoading = true;
      state.listError = "";
    },
    recommendedVideoFetchSuccess(state, { payload }) {
      if (payload.isHomeScreen) {
        state.homeRecommendVideos = payload.data;
      } else {
        state.recommendVideos = payload.data;
      }

      state.listLoading = false;
    },
    recommendedVideoFetchFail(state, { payload }) {
      if (payload.isHomeScreen) {
        state.kidError = payload.error;
      } else {
        state.listError = payload.error;
      }

      state.listLoading = false;
      state.recommendVideos = [];
    },
    toggleVideoLike() {},
    toggleVideoLikeSuccess(state, { payload }) {
      const { videoId, total_likes } = payload;

      const videoIdx = state.videos.findIndex((video) => video._id === videoId);

      if (videoIdx > -1) {
        state.videos[videoIdx].total_likes = total_likes;
        state.videos[videoIdx].isLiked = !state.videos.isLiked;
      }

      state.videoDetail.total_likes = total_likes;
      state.videoDetail.isLiked = !state.videoDetail.isLiked;
    },
    toggleVideoLikeFail(state, { payload }) {
      state.kidError = payload;
    },
    updateKidWatchHistory() {},
    removeKidError(state) {
      state.kidError = "";
    },
  },
});

export const {
  sliderImageFetch,
  sliderImagesFetchSuccess,
  sliderImagesFetchFailure,
  categoryFetch,
  categoryFetchSuccess,
  categoryFetchFailure,
  specificCategoryFetch,
  specificCategoryFetchSuccess,
  specificCategoryFetchFailure,
  extraVideosFetch,
  extraVideosFetchSuccess,
  extraVideosFetchFailure,
  videoDetailFetch,
  videoDetailFetchSuccess,
  videoDetailFetchFail,
  removeVideoDetail,
  recommendedVideoFetch,
  recommendedVideoFetchSuccess,
  recommendedVideoFetchFail,
  toggleVideoLike,
  toggleVideoLikeSuccess,
  toggleVideoLikeFail,
  updateKidWatchHistory,
  removeKidError,
} = kidSlice.actions;

export default kidSlice.reducer;

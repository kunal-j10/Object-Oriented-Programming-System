import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  videoDetail: null,
  recommendVideos: [],
  homeRecommendVideos: [],
  isVideosLoading: null,
  isVideosRefreshing: false,
  isVideoLoading: false,
  isVideoRecomLoading: false,
  isAudioUploading: false,
  isAudioUploaded: false,
  inFullScreen: false,
  errorToast: "",
  listError: "",
};

export const rhymesSlice = createSlice({
  name: "rhymes",
  initialState,
  reducers: {
    fetchRhymeVideos(state, { payload }) {
      state.listError = "";
      if (payload === "loading") {
        state.isVideosLoading = true;
      } else if (payload === "refreshing") {
        state.isVideosRefreshing = true;
      }
    },
    fetchRhymeVideosSuccess(state, { payload: { videos, status } }) {
      state.videos = videos;
      if (status === "loading") {
        state.isVideosLoading = false;
      } else if (status === "refreshing") {
        state.isVideosRefreshing = false;
      }
    },
    fetchRhymeVideosFail(state, { payload }) {
      state.isVideosLoading = false;
      state.isVideosRefreshing = false;
      state.listError = payload;
    },
    fetchRhymeVideoDetail(state) {
      state.isVideoLoading = true;
    },
    fetchRhymeVideoDetailSuccess(state, { payload }) {
      state.videoDetail = payload;
      state.isVideoLoading = false;
    },
    fetchRhymeVideoDetailFail(state, { payload }) {
      state.isVideoLoading = false;
      state.errorToast = payload;
    },
    removeRhymeVideoDetail(state) {
      state.videoDetail = null;
      state.recommendVideos = [];
    },
    fetchRecommendRhymeVideos(state) {
      state.isVideoRecomLoading = true;
    },
    fetchRecommendRhymeVideosSuccess(state, { payload }) {
      if (payload.isHomeScreen) {
        state.homeRecommendVideos = payload.data;
      } else {
        state.recommendVideos = payload.data;
      }
      state.isVideoRecomLoading = false;
    },
    fetchRecommendRhymeVideosFail(state, { payload }) {
      state.isVideoRecomLoading = false;
      state.errorToast = payload;
    },
    toggleRhymeVideoLike() {},
    toggleRhymeVideoLikeSuccess(state, { payload: { no_of_likes, isLiked } }) {
      state.videoDetail.no_of_likes = no_of_likes;
      state.videoDetail.isLiked = isLiked;
    },
    toggleRhymeVideoLikeFail(state, { payload }) {
      state.errorToast = payload;
    },
    updateCustomAudio(state) {
      state.isAudioUploading = true;
    },
    updateCustomAudioSuccess(state) {
      state.isAudioUploading = false;
      state.isAudioUploaded = true;
    },
    updateCustomAudioFail(state, { payload }) {
      state.isAudioUploading = false;
      state.isAudioUploaded = false;
      state.errorToast = payload;
    },
    changeIsAudioUploaded(state) {
      state.isAudioUploaded = false;
    },
    deleteCustomAudio() {},
    deleteCustomAudioFail(state, { payload }) {
      state.errorToast = payload;
    },
    toggleFullScreen(state) {
      state.inFullScreen = !state.inFullScreen;
    },
    removeErrorToast(state) {
      state.errorToast = "";
    },
    rhymesUpdateWatchHistory() {},
    rhymesUpdateWatchHistorySuccess(state, { payload }) {
      state.videoDetail.status =
        state.videoDetail.status === "completed" ? "completed" : payload;
    },
  },
});

export const {
  fetchRhymeVideos,
  fetchRhymeVideosSuccess,
  fetchRhymeVideosFail,
  fetchRhymeVideoDetail,
  fetchRhymeVideoDetailSuccess,
  fetchRhymeVideoDetailFail,
  removeRhymeVideoDetail,
  fetchRecommendRhymeVideos,
  fetchRecommendRhymeVideosSuccess,
  fetchRecommendRhymeVideosFail,
  toggleRhymeVideoLike,
  toggleRhymeVideoLikeSuccess,
  toggleRhymeVideoLikeFail,
  updateCustomAudio,
  updateCustomAudioSuccess,
  updateCustomAudioFail,
  changeIsAudioUploaded,
  deleteCustomAudio,
  deleteCustomAudioFail,
  toggleFullScreen,
  removeErrorToast,
  rhymesUpdateWatchHistory,
  rhymesUpdateWatchHistorySuccess,
} = rhymesSlice.actions;

export default rhymesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getTimeFromMilliSec, updateLikeState } from "../../src/utils/helper";
import unionBy from "lodash/unionBy";

initialState = {
  queue: [],
  selectedSong: null,
  prevSongId: undefined,
  isPlaying: false,
  isBuff: true,
  elapsedString: "00:00",
  elapsedMill: 0,
  totalMill: 0,
  totalString: "00:00",
  loop: 0, //0 -> no loop, 1 -> repeat all, 2 -> repeat current
  loopWarn: "",
  recentlyPlayed: [],
  recording: [],
  detailView: [],
  detailViewCount: "0",
  exploreCategories: [],
  playlistCategories: [],
  exploreCategoryLoading: false,
  playlistCategoryLoading: false,
  timer: null,
  loadingDetail: false,
  loadingRecently: true,
  loadingAllSleep: true,
  error: "",
  listError: "",
};

const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {
    sleepPlayToggle(state, { payload }) {
      state.isPlaying = payload.isPlaying ?? false;
      state.isBuff = payload.isBuff ?? false;
    },
    sleepUpdateTime(state, { payload }) {
      state.elapsedMill = payload;
      const { second, minute } = getTimeFromMilliSec(payload);
      state.elapsedString = `${minute}:${second}`;
    },
    sleepTotalDur(state, { payload }) {
      state.totalMill = payload;
      const { second, minute } = getTimeFromMilliSec(payload);
      state.totalString = `${minute}:${second}`;
    },
    updateLoop(state) {
      state.loop = (state.loop + 1) % 3;
    },
    playPrev(state) {
      const len = state.queue.length;
      let idx = state.queue.findIndex(
        (item) => item._id === state.selectedSong._id
      );

      if (state.loop === 0 && idx === 0) {
        state.loopWarn = "No song found";
      } else {
        idx = idx === 0 ? len : idx;
        state.prevSongId = state.selectedSong._id;
        state.selectedSong = state.queue[(idx - 1) % len];
      }
    },
    playNext(state) {
      const len = state.queue.length;
      const idx = state.queue.findIndex(
        (item) => item._id === state.selectedSong._id
      );

      if (state.loop === 0 && idx === len - 1) {
        state.loopWarn = "No more song added";
      } else {
        state.prevSongId = state.selectedSong._id;
        state.selectedSong = state.queue[(idx + 1) % len];
        state.elapsedString = "00:00";
        state.elapsedMill = 0;
        state.totalMill = 0;
      }
    },
    sleepRemoveLoopWarn(state) {
      state.loopWarn = "";
    },
    sleepRecentlyFetch(state, { payload }) {
      !payload?.isDetail && (state.loadingRecently = true);
    },
    sleepRecentlyFetchSuccess(state, { payload }) {
      state.loadingRecently = false;
      state.recentlyPlayed = payload;
    },
    sleepRecentlyFetchFail(state, { payload }) {
      state.loadingRecently = false;
      state.error = payload;
    },
    sleepSelectSong(state, { payload }) {
      const { songId, queueName } = payload;
      const newSong = state[queueName].find((item) => item._id === songId);
      state.prevSongId = state.selectedSong?._id;
      state.selectedSong = newSong;
    },
    sleepRecommendFetch() {},
    sleepRecommendFetchsuccess(state, { payload }) {
      state.queue = unionBy(state.queue, payload, "_id");
    },
    sleepRecommendFetchFail(state, { payload }) {},
    sleepToggleLike() {},
    sleepToggleLikeSuccess(state, { payload }) {
      const { lullabyId, isLiked } = payload;

      const likedData = { isLiked };

      updateLikeState(state.queue, lullabyId, likedData);
      updateLikeState(state.recentlyPlayed, lullabyId, likedData);
      updateLikeState(state.detailView, lullabyId, likedData);

      if (state.selectedSong) {
        state.prevSongId = state.selectedSong._id;
        state.selectedSong.isLiked = isLiked;
      }
    },
    sleepToggleLikeFail() {},
    sleepStoreHistory() {},
    sleepStoreHistorySuccess(state) {
      if (
        !state.recentlyPlayed.find(
          (item) => item._id === state.selectedSong._id
        )
      ) {
        state.recentlyPlayed.unshift(state.selectedSong);
      }
    },
    sleepStoreHistoryFail(state, { payload }) {},
    sleepDetailFetch(state) {
      state.loadingDetail = true;
      state.listError = "";
    },
    sleepDetailFetchSuccess(state, { payload }) {
      state.detailView = payload.data;
      state.detailViewCount = payload.count;
      state.loadingDetail = false;
    },
    sleepDetailFetchFail(state, { payload }) {
      state.loadingDetail = false;
      state.detailView = [];
      state.detailViewCount = "0";
      state.listError = payload;
    },
    sleepAddTimer(state, { payload }) {
      const { h, m, s } = payload;

      state.timer = (h * 3600 + m * 60 + s) * 1000;
    },
    sleepRemoveError(state) {
      state.error = "";
    },
    sleepFetchExploreCategories(state, { payload }) {
      state.exploreCategoryLoading = true;
    },
    sleepFetchExploreCategoriesSuccess(state, { payload }) {
      state.exploreCategories = payload;
      state.exploreCategoryLoading = false;
    },
    sleepFetchExploreCategoriesFail(state, { payload }) {
      state.exploreCategoryLoading = false;
      state.error = payload;
    },
    sleepFetchPlaylistCategories(state, { payload }) {
      state.playlistCategoryLoading = true;
    },
    sleepFetchPlaylistCategoriesSuccess(state, { payload }) {
      state.playlistCategories = payload;
      state.playlistCategoryLoading = false;
    },
    sleepFetchPlaylistCategoriesFail(state, { payload }) {
      state.playlistCategoryLoading = false;
      state.error = payload;
    },
    sleepPlayAll(state, { payload }) {
      state.queue = payload;
      state.selectedSong = state.queue[0];
      state.prevSongId = undefined;
      state.isPlaying = true;
      state.isBuff = true;
      state.elapsedString = "00:00";
      state.elapsedMill = 0;
      state.totalMill = 0;
      state.totalString = "00:00";
      state.loop = 0;
      state.loopWarn = "";
    },
  },
});

export const {
  sleepPlayToggle,
  sleepUpdateTime,
  sleepTotalDur,
  updateLoop,
  playPrev,
  playNext,
  sleepRemoveLoopWarn,
  sleepRecentlyFetch,
  sleepRecentlyFetchSuccess,
  sleepRecentlyFetchFail,
  sleepRecordingFetch,
  sleepRecordingFetchFail,
  sleepSelectSong,
  sleepRecommendFetch,
  sleepRecommendFetchsuccess,
  sleepRecommendFetchFail,
  sleepToggleLike,
  sleepToggleLikeSuccess,
  sleepToggleLikeFail,
  sleepStoreHistory,
  sleepStoreHistorySuccess,
  sleepStoreHistoryFail,
  sleepRemoveError,
  sleepDetailFetch,
  sleepDetailFetchFail,
  sleepDetailFetchSuccess,
  sleepAddTimer,
  sleepFetchExploreCategories,
  sleepFetchExploreCategoriesSuccess,
  sleepFetchExploreCategoriesFail,
  sleepFetchPlaylistCategories,
  sleepFetchPlaylistCategoriesSuccess,
  sleepFetchPlaylistCategoriesFail,
  sleepPlayAll,
} = sleepSlice.actions;

export default sleepSlice.reducer;

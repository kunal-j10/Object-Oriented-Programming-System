import { createSlice } from "@reduxjs/toolkit";
import { State } from "react-native-gesture-handler";

const initialState = {
  activityDetail: null,
  activityDetailLoading: true,
  activities: [],
  lvl1ComId: null,
  lvl1ParentName: "",
  lvl1com: [],
  lvl2com: [],
  recommendedActivitiesLoader: null,
  recommendedActivities: [],
  recommendedActivitiesError: "",
  comLastUpdatedDtm: null,
  comReachedTillEnd: false,
  statusLoading: false,
  likeToast: "",
  statusToast: "",
  activitiesLoading: true,
  isComLoading: false,
  isComRefreshing: false,
  error: "",
  listError: "",
  successMessage: "",
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    activityFetch(state) {
      state.activitiesLoading = true;
      state.listError = "";
    },
    activityFetchSuccess(state, { payload }) {
      state.activities = payload;
      state.activitiesLoading = false;
    },
    activityFetchFailed(state, { payload }) {
      state.activities = [];
      state.activitiesLoading = false;
      state.listError = payload;
    },
    activityDetail(state) {
      state.activityDetailLoading = true;
    },
    activityDetailSuccess(state, { payload }) {
      state.activityDetail = payload.activityDetails;
      state.activityDetailLoading = false;
    },
    activityDetailFailure(state, { payload }) {
      state.activityDetailLoading = false;
      state.activityDetail = null;
      state.error = payload;
    },
    toggleLike() {},
    toggleLikeSuccess(state, { payload }) {
      // Update number of likes in activity array
      const indexofActivity = state.activities.findIndex(
        (item) => item._id == payload.activityId
      );
      const item = state.activities[indexofActivity];
      let activityList = [...state.activities];
      activityList[indexofActivity] = {
        ...item,
        no_of_likes: payload.data.no_of_likes,
        isLiked: payload.data.isLiked,
      };
      // Update number of likes in selected activity details screen
      if (state.activityDetail) {
        let activityItem = state.activityDetail; // extract selected activity details data and update no of likes and isLiked fields
        activityItem.no_of_likes = payload.data.no_of_likes;
        activityItem.isLiked = payload.data.isLiked;
        state.activityDetail = activityItem;
      }
      if (payload.data.isLiked == true) {
        state.likeToast = "Liked";
      } else {
        state.likeToast = "Disiked";
      }
    },
    toggleLikeFailure(state, { payload }) {
      state.error = payload;
      state.likeToast = "Try again";
    },
    activityFetchLvl1Com(state, { payload: { status } }) {
      if (status === "loading") {
        state.isComLoading = true;
      } else if (status === "refreshing") {
        state.isComRefreshing = true;
      }
    },
    activityFetchLvl1ComSuccess(state, { payload }) {
      if (!payload.comReachedTillEnd) {
        state.lvl1com = state.lvl1com.concat(payload.lvl1com);
        state.comLastUpdatedDtm = payload.comLastUpdatedDtm;
        state.comReachedTillEnd = payload.comReachedTillEnd;
      } else {
        state.comReachedTillEnd = payload.comReachedTillEnd;
      }
      state.isComLoading = false;
      state.isComRefreshing = false;
    },
    activityFetchLvl1ComFail(state, { payload }) {
      state.isComLoading = false;
      state.isComRefreshing = false;
      state.comReachedTillEnd = true;
      state.error = payload;
    },
    activityRemoveLvl1Com(state) {
      state.lvl1ComId = null;
      state.lvl1ParentName = "";
      state.lvl1com = [];
      state.lvl2com = [];
      state.comLastUpdatedDtm = null;
      state.comReachedTillEnd = false;
    },
    activityFetchLvl2Com() {},
    activityFetchLvl2ComSuccess(state, { payload }) {
      const othersCom = state.lvl2com.filter(
        (comment) => comment.level1_comment_id !== payload.lvl1ComId
      );
      state.lvl2com = othersCom.concat(payload.lvl2com);
    },
    activityFetchLvl2ComFail(state, { payload }) {
      state.error = payload;
    },
    activityRemoveLvl2Com(state, { payload }) {
      const prev = state.lvl2com.filter(
        (comment) => comment.level1_comment_id !== payload
      );
      state.lvl2com = prev;
    },
    activityAddCom() {},
    activityAddComSuccess(state, { payload }) {
      if (!state.lvl1ComId) {
        state.lvl1com.unshift(payload.newComment);
        const comLastUpdatedDtm =
          state.lvl1com[state.lvl1com.length - 1].lastUpdatedDtm;

        state.comLastUpdatedDtm = comLastUpdatedDtm;
      } else {
        const commentIdx = state.lvl1com.findIndex(
          (item) => item._id === payload.newComment.level1_comment_id
        );

        state.lvl1com[commentIdx].no_of_level2_comments =
          payload.no_of_level2_comments;
        state.lvl2com.unshift(payload.newComment);
      }

      state.lvl1ComId = null;
      state.lvl1ParentName = "";
    },
    activityAddComFail(state, { payload }) {
      state.error = payload;
    },
    activityToggleComLike() {},
    activityToggleComLikeSuccess(state, { payload }) {
      if (payload.type === "lvl1") {
        const lvl1Idx = state.lvl1com.findIndex(
          (item) => item._id === payload.commentId
        );

        state.lvl1com[lvl1Idx].no_of_likes = payload.no_of_likes;
        state.lvl1com[lvl1Idx].isLiked = payload.isLiked;
      } else if (payload.type === "lvl2") {
        const lvl2Idx = state.lvl2com.findIndex(
          (item) => item._id === payload.commentId
        );

        state.lvl2com[lvl2Idx].no_of_likes = payload.no_of_likes;
        state.lvl2com[lvl2Idx].isLiked = payload.isLiked;
      }
    },
    activityToggleComLikeFail(state, { payload }) {
      state.error = payload;
    },
    activitySetReplyHandler(state, { payload }) {
      state.lvl1ComId = payload.lvl1ComId;
      state.lvl1ParentName = payload.lvl1ParentName;
    },
    activityCloseReplyHandler(state) {
      state.lvl1ComId = null;
      state.lvl1ParentName = "";
    },
    statusFetch(state) {
      state.statusLoading = true;
    },
    statusFetchSuccess(state, { payload }) {
      const videoDetailFromactivities = state.activities.find(
        (video) => video._id === payload.id
      );

      const videoDetailFromrecommendedActivities =
        state.recommendedActivities.find((video) => video._id === payload.id);

      if (videoDetailFromactivities) {
        videoDetailFromactivities.status = payload.status;
        state.statusToast = payload.status;
      } else if (videoDetailFromrecommendedActivities) {
        videoDetailFromrecommendedActivities.status = payload.status;
        state.statusToast = payload.status;
      } else {
        state.activityDetail.status = payload.status;
        state.statusToast = payload.status;
      }

      state.statusLoading = false;
    },
    statusFetchFailure(state) {
      state.statusLoading = false;
      state.statusToast = "Try Again";
    },
    recommendedActivitiesSuccess(state, { payload }) {
      state.recommendedActivities = payload;
      state.recommendedActivitiesLoader = false;
    },
    recommendedActivitiesFailure(state, { payload }) {
      state.recommendedActivitiesError = payload;
      state.recommendedActivitiesLoader = false;
    },
    recommendedActivitiesFetch(state) {
      state.recommendedActivitiesLoader = true;
    },
    removeToastStatus(state) {
      state.statusToast = "";
    },
    removeToastLike(state) {
      state.likeToast = "";
    },
    activityCommentDelete(state) {
      state.activityDetailLoading = true;
    },
    activityCommentDeleteSuccess(state, { payload }) {
      state.lvl1com = state.lvl1com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl2com = state.lvl2com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl1ComId = null;

      state.activityDetailLoading = false;
      state.successMessage = payload.message;
    },
    activityCommentDeleteFail(state, { payload }) {
      state.activityDetailLoading = false;
      state.error = payload;
    },
    activityCommentReport(state) {
      state.activityDetailLoading = true;
    },
    activityCommentReportSuccess(state, { payload }) {
      state.lvl1com = state.lvl1com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl2com = state.lvl2com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl1ComId = null;

      state.activityDetailLoading = false;
      state.successMessage = payload.message;
    },
    activityCommentReportFail(state, { payload }) {
      state.activityDetailLoading = false;
      state.error = payload;
    },
    activityRemoveSuccessMessage(state) {
      state.successMessage = "";
    },
    activityRemoveError(state) {
      state.error = "";
    },
    activitiesViewsCount() {},
  },
});

export const {
  activityFetch,
  activityFetchSuccess,
  activityFetchFailed,
  toggleLikeSuccess,
  toggleLikeFailure,
  toggleLike,
  activityFetchLvl1Com,
  activityFetchLvl1ComSuccess,
  activityFetchLvl1ComFail,
  activityRemoveLvl1Com,
  activityFetchLvl2Com,
  activityFetchLvl2ComSuccess,
  activityFetchLvl2ComFail,
  activityRemoveLvl2Com,
  activityAddCom,
  activityAddComSuccess,
  activityAddComFail,
  activityToggleComLike,
  activityToggleComLikeSuccess,
  activityToggleComLikeFail,
  activitySetReplyHandler,
  activityCloseReplyHandler,
  activityRemoveError,
  statusFetch,
  statusFetchSuccess,
  statusFetchFailure,
  recommendedActivitiesFetch,
  recommendedActivitiesSuccess,
  recommendedActivitiesFailure,
  removeToastStatus,
  removeToastLike,
  activityDetail,
  activityDetailSuccess,
  activityDetailFailure,
  activitiesViewsCount,
  activityCommentDelete,
  activityCommentDeleteSuccess,
  activityCommentDeleteFail,
  activityCommentReport,
  activityCommentReportSuccess,
  activityCommentReportFail,
  activityRemoveSuccessMessage,
} = activitySlice.actions;

export default activitySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  lastUpdatedDtm: null,
  postReachedTillEnd: false,
  lvl1ComId: null,
  lvl1ParentName: "",
  lvl1com: [],
  lvl2com: [],
  comLastUpdatedDtm: null,
  comReachedTillEnd: false,
  profile: [],
  qAndA: [],
  isPostLoading: false,
  isPostRefreshing: false,
  isComLoading: false,
  isComRefreshing: false,
  isProfileLoading: false,
  isQandALoading: false,
  isImagesUploading: false,
  isImagesUploaded: false,
  errorToast: "",
  deletePostLoading: null,
  deletePostToast: "",
  reportPostLoading: null,
  reportPostToast: "",
  searchPostLoading: null,
  searchPosterr: "",
  searchedPosts: [],
  communityDetail: null,
  communityDetailLoading: true,
  currViewedPostIds: [],
  allViewedPostIds: [],
  trendingPosts: [],
  isTrendingPostsLoad: [],
  successMessage: "",
  expertReportLoading: false,
  expertReportStatus: "",
};

export const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    fetchPost(state, { payload: { status } }) {
      if (status === "loading") {
        state.isPostLoading = true;
      } else if (status === "refreshing") {
        state.isPostRefreshing = true;
      }
    },
    fetchPostSuccess(state, { payload }) {
      if (!payload.postReachedTillEnd) {
        state.posts = payload.posts;
        state.lastUpdatedDtm = payload.lastUpdatedDtm;
        state.postReachedTillEnd = payload.postReachedTillEnd;
      } else {
        state.postReachedTillEnd = payload.postReachedTillEnd;
      }
      state.isPostLoading = false;
      state.isPostRefreshing = false;
    },
    fetchPostFail(state, { payload }) {
      state.isPostLoading = false;
      state.isPostRefreshing = false;
      state.postReachedTillEnd = true;
      state.errorToast = payload;
    },
    communityDetail(state) {
      state.communityDetailLoading = true;
    },
    communityDetailSuccess(state, { payload }) {
      state.communityDetail = payload.post;
      state.communityDetailLoading = false;
    },
    communityDetailFailure(state, { payload }) {
      state.communityDetail = null;
      state.communityDetailLoading = false;
      state.errorToast = payload;
    },
    fetchExtraPost() {},
    fetchExtraPostSuccess(state, { payload }) {
      if (!payload.postReachedTillEnd) {
        state.posts = state.posts.concat(payload.posts);
        state.lastUpdatedDtm = payload.lastUpdatedDtm;
        state.postReachedTillEnd = payload.postReachedTillEnd;
      } else {
        state.postReachedTillEnd = payload.postReachedTillEnd;
      }
    },
    fetchExtraPostFail(state, { payload }) {
      state.errorToast = payload;
    },
    toggleLike() {},
    toggleLikeSuccess(state, { payload }) {
      const postIdinPostsList = state.posts.findIndex(
        (item) => item._id === payload.postId
      );
      const postIdinSearchedList = state.searchedPosts.findIndex(
        (item) => item._id === payload.postId
      );
      const postIdTrendingList = state.trendingPosts.findIndex(
        (item) => item._id === payload.postId
      );

      if (postIdinPostsList >= 0) {
        state.posts[postIdinPostsList].no_of_likes = payload.no_of_likes;
        state.posts[postIdinPostsList].isLiked = payload.isLiked;
        state.posts[postIdinPostsList].no_of_comments = payload.no_of_comments;
      }
      if (postIdinSearchedList >= 0) {
        state.searchedPosts[postIdinSearchedList].no_of_likes =
          payload.no_of_likes;
        state.searchedPosts[postIdinSearchedList].isLiked = payload.isLiked;
        state.searchedPosts[postIdinSearchedList].no_of_comments =
          payload.no_of_comments;
      }
      if (postIdTrendingList >= 0) {
        state.trendingPosts[postIdTrendingList].no_of_likes =
          payload.no_of_likes;
        state.trendingPosts[postIdTrendingList].isLiked = payload.isLiked;
        state.trendingPosts[postIdTrendingList].no_of_comments =
          payload.no_of_comments;
      }
    },
    toggleLikeFail(state, { payload }) {
      state.errorToast = payload;
    },
    fetchLvl1Com(state, { payload: { status } }) {
      if (status === "loading") {
        state.isComLoading = true;
      } else if (status === "refreshing") {
        state.isComRefreshing = true;
      }
    },
    fetchLvl1ComSuccess(state, { payload }) {
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
    fetchLvl1ComFail(state, { payload }) {
      state.isComLoading = false;
      state.isComRefreshing = false;
      state.comReachedTillEnd = true;
      state.errorToast = payload;
    },
    removeLvl1Com(state) {
      state.lvl1com = [];
      state.lvl2com = [];
      state.comLastUpdatedDtm = null;
      state.lvl1ComId = null;
      state.lvl1ParentName = "";
    },
    fetchLvl2Com() {},
    fetchLvl2ComSuccess(state, { payload }) {
      const othersCom = state.lvl2com.filter(
        (comment) => comment.level1_comment_id !== payload.lvl1ComId
      );
      state.lvl2com = othersCom.concat(payload.lvl2com);
    },
    fetchLvl2ComFail(state, { payload }) {
      state.errorToast = payload;
    },
    removeLvl2Com(state, { payload }) {
      const prev = state.lvl2com.filter(
        (comment) => comment.level1_comment_id !== payload
      );
      state.lvl2com = prev;
    },
    addLvlCom() {},
    addLvlComSuccess(state, { payload }) {
      if (!state.lvl1ComId) {
        state.lvl1com.unshift(payload.data);
        const comLastUpdatedDtm =
          state.lvl1com[state.lvl1com.length - 1].lastUpdatedDtm;

        state.comLastUpdatedDtm = comLastUpdatedDtm;

        const postIdinPostsList = state.posts.findIndex(
          (post) => post._id === payload.data.postId
        );

        const postIdinSearchedList = state.searchedPosts.findIndex(
          (post) => post._id === payload.data.postId
        );

        if (postIdinPostsList >= 0 && postIdinSearchedList >= 0) {
          state.posts[postIdinPostsList].no_of_comments =
            payload.no_of_comments;
          // state.searchedPosts[postIdinSearchedList].no_of_comments =
          //   payload.no_of_comments;
        } else if (postIdinPostsList >= 0) {
          state.posts[postIdinPostsList].no_of_comments =
            payload.no_of_comments;
        } else {
          state.searchedPosts[postIdinSearchedList].no_of_comments =
            payload.no_of_comments;
        }
      } else {
        const commentIdx = state.lvl1com.findIndex(
          (item) => item._id === payload.data.level1_comment_id
        );

        state.lvl1com[commentIdx].no_of_level2_comments =
          payload.no_of_level2_comments;
        state.lvl2com.unshift(payload.data);
      }

      state.lvl1ComId = null;
      state.lvl1ParentName = "";
    },
    addLvlComFail(state, { payload }) {
      state.errorToast = payload;
    },
    toggleLvlComLike() {},
    toggleLvlComLikeSuccess(state, { payload }) {
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
    toggleLvlComLikeFail(state, { payload }) {
      state.errorToast = payload;
    },
    setReplyHandler(state, { payload }) {
      state.lvl1ComId = payload.lvl1ComId;
      state.lvl1ParentName = payload.lvl1ParentName;
    },
    closeReplyHandler(state) {
      state.lvl1ComId = null;
      state.lvl1ParentName = "";
    },
    fetchProfile(state) {
      state.isProfileLoading = true;
    },
    fetchProfileSuccess(state, { payload }) {
      state.isProfileLoading = false;
      state.profile = payload;
    },
    fetchProfileFail(state, { payload }) {
      state.isProfileLoading = false;
      state.errorToast = payload;
    },
    toggleFollow() {},
    toggleFollowSuccess(state, { payload }) {
      state.profile.isFollowing = payload;
    },
    toggleFollowFail(state, { payload }) {
      state.errorToast = payload;
    },
    getQna(state) {
      state.isQandALoading = true;
    },
    getQnaSuccess(state, { payload }) {
      state.isQandALoading = false;
      state.qAndA = payload;
    },
    getQnaFail(state, { payload }) {
      state.isQandALoading = false;
      state.errorToast = payload;
    },
    createPost(state) {
      state.isImagesUploading = true;
    },
    createPostSuccess(state) {
      state.isImagesUploading = false;
      state.isImagesUploaded = true;
    },
    createPostFail(state, { payload }) {
      state.isImagesUploading = false;
      state.isImagesUploaded = false;
      state.errorToast = payload;
    },
    changeIsImagesUploaded(state) {
      state.isImagesUploaded = false;
    },
    removeErrorToast(state) {
      state.errorToast = "";
    },
    deletePost(state) {
      state.deletePostLoading = true;
    },
    deletePostSuccess(state, { payload }) {
      state.deletePostLoading = false;
      state.posts = state.posts.filter((item) => item._id != payload.postId);
      state.deletePostToast = payload.message;
    },
    deletePostFailure(state, { payload }) {
      state.deletePostLoading = false;
      state.deletePostToast = "Failed";
    },
    reportPost(state) {
      state.deletePostLoading = true;
    },
    reportPostSuccess(state, { payload }) {
      state.reportPostLoading = false;
      state.reportPostToast = payload.message;
    },
    reportPostFailure(state, { payload }) {
      state.reportPostLoading = false;
      state.reportPostToast = "Failed";
    },
    searchPost(state) {
      state.searchPostLoading = true;
    },
    searchtPostSuccess(state, { payload }) {
      state.searchPostLoading = false;

      if (payload.count > 0) {
        state.searchPosterr = "";
      } else {
        state.searchPosterr = "Sorry no post found";
      }
      state.searchedPosts = payload.posts;
    },
    searchPostFailure(state, { payload }) {
      state.searchPostLoading = false;
      if (payload.count > 0) {
        state.searchPosterr = "Sorry no post found";
      }
    },
    emptySearchPost() {},
    emptySearchPostSucccess(state) {
      state.searchedPosts = [];
      state.searchPosterr = "";
    },
    emptySearchPostFailure(state) {
      state.searchedPosts = [];
      state.searchPosterr = "";
    },
    communityAddViewedPost(state, { payload }) {
      const newPostIds = payload.filter(
        (id) => !state.allViewedPostIds.includes(id)
      );

      state.currViewedPostIds = state.currViewedPostIds.concat(newPostIds);
      state.allViewedPostIds = state.allViewedPostIds.concat(newPostIds);
    },
    communityIncrementViewCount() {},
    communityIncrementViewCountSuccess(state) {
      state.currViewedPostIds = [];
    },
    communityFetchTrendingPost(state, { payload }) {
      state.isTrendingPostsLoad = true;
    },
    communityFetchTrendingPostSuccess(state, { payload }) {
      state.isTrendingPostsLoad = false;
      state.trendingPosts = payload;
    },
    communityFetchTrendingPostFail(state, { payload }) {
      state.isTrendingPostsLoad = false;
      state.errorToast = payload;
    },
    communityCommentDelete(state) {
      state.communityDetailLoading = true;
    },
    communityCommentDeleteSuccess(state, { payload }) {
      state.lvl1com = state.lvl1com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl2com = state.lvl2com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl1ComId = null;

      state.communityDetailLoading = false;
      state.successMessage = payload.message;
    },
    communityCommentDeleteFail(state, { payload }) {
      state.communityDetailLoading = false;
      state.errorToast = payload;
    },
    communityCommentReport(state) {
      state.communityDetailLoading = true;
    },
    communityCommentReportSuccess(state, { payload }) {
      state.lvl1com = state.lvl1com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl2com = state.lvl2com.filter(
        (item) => item._id !== payload.commentId
      );

      state.lvl1ComId = null;

      state.communityDetailLoading = false;
      state.successMessage = payload.message;
    },
    communityCommentReportFail(state, { payload }) {
      state.communityDetailLoading = false;
      state.errorToast = payload;
    },
    removeSuccessMessage(state) {
      state.successMessage = "";
    },
    expertViewsCount() {},
    expertReportfetch(state) {
      state.expertReportLoading = true;
    },
    expertReportfetchSuccess(state, { payload }) {
      (state.expertReportLoading = false), (state.expertReportStatus = payload);
    },
    expertReportfetchFailure(state, { payload }) {
      (state.expertReportLoading = false), (state.expertReportStatus = payload);
    },
    expertemptyReportBlockStatus(){},
    expertemptyReportBlockStatusSuccess(state){
      state.expertReportStatus = ""
    },
    expertemptyReportBlockStatusFailure(state){
      state.expertReportStatus = ""
    }
  },
});

export const {
  fetchPost,
  fetchPostSuccess,
  fetchPostFail,
  fetchExtraPost,
  fetchExtraPostSuccess,
  fetchExtraPostFail,
  toggleLike,
  toggleLikeSuccess,
  toggleLikeFail,
  fetchLvl1Com,
  fetchLvl1ComSuccess,
  fetchLvl1ComFail,
  removeLvl1Com,
  fetchLvl2Com,
  fetchLvl2ComSuccess,
  fetchLvl2ComFail,
  removeLvl2Com,
  addLvlCom,
  addLvlComSuccess,
  addLvlComFail,
  toggleLvlComLike,
  toggleLvlComLikeSuccess,
  toggleLvlComLikeFail,
  setReplyHandler,
  closeReplyHandler,
  fetchProfile,
  fetchProfileSuccess,
  fetchProfileFail,
  toggleFollow,
  toggleFollowSuccess,
  toggleFollowFail,
  getQna,
  getQnaSuccess,
  getQnaFail,
  createPost,
  createPostSuccess,
  createPostFail,
  changeIsImagesUploaded,
  removeErrorToast,
  deletePost,
  deletePostSuccess,
  deletePostFailure,
  reportPost,
  reportPostSuccess,
  reportPostFailure,
  searchPost,
  searchtPostSuccess,
  searchPostFailure,
  emptySearchPost,
  emptySearchPostSucccess,
  emptySearchPostFailure,
  communityDetail,
  communityDetailSuccess,
  communityDetailFailure,
  communityAddViewedPost,
  communityIncrementViewCount,
  communityIncrementViewCountSuccess,
  communityFetchTrendingPost,
  communityFetchTrendingPostSuccess,
  communityFetchTrendingPostFail,
  communityCommentDelete,
  communityCommentDeleteSuccess,
  communityCommentDeleteFail,
  communityCommentReport,
  communityCommentReportSuccess,
  communityCommentReportFail,
  removeSuccessMessage,
  expertViewsCount,
  expertReportfetch,
  expertReportfetchSuccess,
  expertReportfetchFailure,
  expertemptyReportBlockStatus,
  expertemptyReportBlockStatusSuccess,
  expertemptyReportBlockStatusFailure
} = communitySlice.actions;

export default communitySlice.reducer;

export const communityPostsSelector = (state) => state.community.posts;

export const communityLastUpdatedDtmSelector = (state) =>
  state.community.lastUpdatedDtm;

export const communityPostReachedTillEndSelector = (state) =>
  state.community.postReachedTillEnd;

export const communityLvl1ComIdSelector = (state) => state.community.lvl1ComId;

export const communityLvl1ParentNameSelector = (state) =>
  state.community.lvl1ParentName;

export const communityLvl1comSelector = (state) => state.community.lvl1com;

export const communityLvl2comSelector = (state) => state.community.lvl2com;

export const communityComLastUpdatedDtmSelector = (state) =>
  state.community.comLastUpdatedDtm;

export const communityComReachedTillEndSelector = (state) =>
  state.community.comReachedTillEnd;

export const communityProfileSelector = (state) => state.community.profile;

export const communityQAndASelector = (state) => state.community.qAndA;

export const communityIsPostLoadingSelector = (state) =>
  state.community.isPostLoading;

export const communityIsPostRefreshingSelector = (state) =>
  state.community.isPostRefreshing;

export const communityIsComLoadingSelector = (state) =>
  state.community.isComLoading;

export const communityIsComRefreshingSelector = (state) =>
  state.community.isComRefreshing;

export const communityProfileLoadingSelector = (state) =>
  state.community.isProfileLoading;

export const communityQAndALoadingSelector = (state) =>
  state.community.isQandALoading;

export const communityIsImagesUploadingSelector = (state) =>
  state.community.isImagesUploading;

export const communityIsImagesUploadedSelector = (state) =>
  state.community.isImagesUploaded;

export const communityErrorToastSelector = (state) =>
  state.community.errorToast;

export const deletePostsLoadingSelector = (state) =>
  state.community.deletePostLoading;

export const deleteToastSelector = (state) => state.community.deletePostToast;

export const reportPostsLoadingSelector = (state) =>
  state.community.reportPostLoading;

export const reportToastSelector = (state) => state.community.reportPostToast;

export const searchPostLoadingSelector = (state) =>
  state.community.searchPostLoading;

export const searchedPostSelector = (state) => state.community.searchedPosts;

export const searchedPosterr = (state) => state.community.searchPosterr;

export const communityDetailSelector = (state) =>
  state.community.communityDetail;

export const communityDetailLoadingSelector = (state) =>
  state.community.communityDetailLoading;

export const communityTrendingPostsSelector = (state) =>
  state.community.trendingPosts;

export const communityIsTrendingPostsLoadSelector = (state) =>
  state.community.isTrendingPostsLoad;

export const communitySuccessMessageSelector = (state) =>
  state.community.successMessage;

export const expertReportLoading = (state) =>
  state.community.expertReportLoading;

export const expertReportStatus = (state) => state.community.expertReportStatus;

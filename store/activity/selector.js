export const activitySelector = (state) => state.activity.activities;

export const activityLvl1ComIdSelector = (state) => state.activity.lvl1ComId;

export const activityLvl1ParentNameSelector = (state) =>
  state.activity.lvl1ParentName;

export const activityLvl1comSelector = (state) => state.activity.lvl1com;

export const activityLvl2comSelector = (state) => state.activity.lvl2com;

export const activityComLastUpdatedDtmSelector = (state) =>
  state.activity.comLastUpdatedDtm;

export const activityComReachedTillEndSelector = (state) =>
  state.activity.comReachedTillEnd;

export const activityLoadingSelector = (state) =>
  state.activity.activitiesLoading;

export const activityIsComLoadingSelector = (state) =>
  state.activity.isComLoading;

export const activityIsComRefreshingSelector = (state) =>
  state.activity.isComRefreshing;

export const activityErrorSelector = (state) => state.activity.error;

export const activityListErrorSelector = (state) => state.activity.listError;

export const RecommendedActivities = (state) => state.activity.recommendedActivities

export const Toastmessage = (state) => state.activity.statusToast

export const Toastlike = (state) => state.activity.likeToast

export const activityDetailSelector = (state) => state.activity.activityDetail

export const activityDetailLoadingSelector = (state) => state.activity.activityDetailLoading


export const recommendedActivitiesLoader = (state) => state.activity.recommendedActivitiesLoader

export const activitySuccessMessageSelector = (state) =>
  state.activity.successMessage;
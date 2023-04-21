import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  activityFetch,
  activityFetchSuccess,
  activityFetchFailed,
  toggleLikeSuccess,
  toggleLike,
  toggleLikeFailure,
  activityFetchLvl1Com,
  activityFetchLvl1ComSuccess,
  activityFetchLvl1ComFail,
  activityFetchLvl2Com,
  activityFetchLvl2ComSuccess,
  activityFetchLvl2ComFail,
  activityAddCom,
  activityAddComSuccess,
  activityAddComFail,
  activityToggleComLike,
  activityToggleComLikeSuccess,
  activityToggleComLikeFail,
  statusFetch,
  statusFetchSuccess,
  statusFetchFailure,
  recommendedActivitiesFetch,
  recommendedActivitiesSuccess,
  recommendedActivitiesFailure,
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
} from "./slice";
import { addNoInternetAction } from "../auth/slice";

const activityFetchLogic = createLogic({
  type: activityFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching activities for specific category (endpoint: /activity) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { category, ageInMonths } = action.payload;

      let param_header = {
        params: {
          childId: selectedChildId,
          dob: activechildDetails?.dob,
          category,
          ageInMonths,
        },
      };

      const res = await momAxios.get("/activity", param_header);

      dispatch(activityFetchSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: activityFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        activityFetchFailed(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const activityDetailFetchLogic = createLogic({
  type: activityDetail.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching activities for specific id (endpoint: /activity) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId ,activechildDetails},
        activity: { activities, recommendedActivities },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const activityId = action.payload;

      let videoDetailFromactivities = activities.find(
        (video) => video._id === activityId
      );

      let videoDetailFromrecommendedActivities = recommendedActivities.find(
        (video) => video._id === activityId
      );

      if (videoDetailFromactivities) {
        dispatch(
          activityDetailSuccess({ activityDetails: videoDetailFromactivities })
        );
      } else if (videoDetailFromrecommendedActivities) {
        dispatch(
          activityDetailSuccess({
            activityDetails: videoDetailFromrecommendedActivities,
          })
        );
      } else
        !videoDetailFromactivities && !videoDetailFromrecommendedActivities;


      const res = await momAxios.get("/activity", {
        params: {
          id: activityId,
          childId: activechildDetails?._id,
          dob: activechildDetails?.dob,
        },
      });

      dispatch(activityDetailSuccess({ activityDetails: res.data }));

      // dispatch(activityDetailSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: activityFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        activityDetailFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const toggleLikeLogic = createLogic({
  type: toggleLike.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the like for specific activity (endpoint: /activity/like) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

  

      if (!activechildDetails)
        throw new Error("First add atleast one child to like the activity");

      const id = action.payload;

      const res = await momAxios.post("/activity/like", {
        childId: selectedChildId,
        activityId: id,
        dob: activechildDetails?.dob,
      });

      dispatch(toggleLikeSuccess({ data: res.data, activityId: id }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleLikeFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const activityFetchLvl1ComLogic = createLogic({
  type: activityFetchLvl1Com.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch comments (only level 1 comment) for specific activity (endpoint: /activity/getLevelOneComment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        activity: { comLastUpdatedDtm },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { activityId } = action.payload;

      const res = await momAxios.get("/activity/getLevelOneComment", {
        params: {
          activityId,
          lastUpdatedDtm: comLastUpdatedDtm,
        },
      });

      if (res.data.count > 0) {
        let comLastUpdatedDtm =
          res.data.data[res.data.count - 1].lastUpdatedDtm;
        dispatch(
          activityFetchLvl1ComSuccess({
            lvl1com: res.data.data,
            comLastUpdatedDtm,
            comReachedTillEnd: false,
          })
        );
      } else {
        dispatch(activityFetchLvl1ComSuccess({ comReachedTillEnd: true }));
      }
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: activityFetchLvl1Com.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        activityFetchLvl1ComFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const activityFetchLvl2ComLogic = createLogic({
  type: activityFetchLvl2Com.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To fetch comments (only level 2 comment) for specific comment (endpoint: /activity/getLevelTwoComment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const commentId = action.payload;

      const res = await momAxios.get("/activity/getLevelTwoComment", {
        params: {
          commentId,
        },
      });

      dispatch(
        activityFetchLvl2ComSuccess({
          lvl2com: res.data.data,
          lvl1ComId: commentId,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        activityFetchLvl2ComFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const activityAddComLogic = createLogic({
  type: activityAddCom.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To add comment (both level 1 & level 2 comment) for specific activity (endpoint: /activity/comment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
        activity: { lvl1ComId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!activechildDetails)
        throw new Error("First add atleast one child to comment on activity");

      const { activityId, comment } = action.payload;

      const res = await momAxios.post("/activity/comment", {
        childId: selectedChildId,
        activityId,
        comment,
        level1_comment_id: lvl1ComId,
      });

      dispatch(
        activityAddComSuccess({
          newComment: res.data.data,
          no_of_level2_comments: res.data.no_of_level2_comments,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        activityAddComFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const activityToggleComLikeLogic = createLogic({
  type: activityToggleComLike.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the like for specific comment (both level 1 & level 2 comment) (endpoint: /activity/comment/like) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { commentId, level1_comment_id } = action.payload;

      const res = await momAxios.post("/activity/comment/like", {
        commentId,
      });

      dispatch(
        activityToggleComLikeSuccess({
          type: level1_comment_id ? "lvl2" : "lvl1",
          no_of_likes: res.data.no_of_likes,
          isLiked: res.data.isLiked,
          commentId,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        activityToggleComLikeFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const statusFetchLogic = createLogic({
  type: statusFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    try {
      crashlytics().log(
        "To complete the activity (endpoint: /activity/store) (Logic)"
      );
      const {
        auth: { selectedChildId, activechildDetails, parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!activechildDetails)
        throw new Error("First add atleast one child to complete the activity");

      const { id, status } = action.payload;

      const res = await momAxios.post("/activity/store", {
        activityId: id,
        dob: activechildDetails?.dob,
        childId: selectedChildId,
        status,
      });

      const data = res.data;

      dispatch(statusFetchSuccess({ id, status: "completed" }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        statusFetchSuccess(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const recommendedActivitiesLogic = createLogic({
  type: recommendedActivitiesFetch.type,
  latest: true,
  async process({ getState, momAxios, networkError }, dispatch, done) {
    try {
      crashlytics().log(
        "To fetch recommended activities for home screen (endpoint: /activity/recommendedActivity) (Logic)"
      );
      const {
        auth: { selectedChildId, activechildDetails, parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/activity/recommendedActivity", {
        params: {
          limit: 4,
          childId: selectedChildId,
          dob: activechildDetails?.dob,
        },
      });

      dispatch(recommendedActivitiesSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: recommendedActivitiesFetch.type,
          })
        );
      }

      dispatch(
        recommendedActivitiesFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const activitiesViewsCountLogic = createLogic({
  type: activitiesViewsCount.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log("To increment activity view count (endpoint: /activity/incViewsCount) (Logic)");
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const activityId = action.payload;

      await momAxios.post(`/activity/incViewsCount`, {
        activityId,
      });
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

const activityCommentDeleteLogic = createLogic({
  type: activityCommentDelete.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To delete the comment in activity (endpoint: (DELETE) /activity/comment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { commentId, activityId } = action.payload;

      const res = await momAxios.delete("/activity/comment", {
        data: { commentId, activityId },
      });

      dispatch(
        activityCommentDeleteSuccess({ commentId, message: res.data.message })
      );
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        activityCommentDeleteFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const activityCommentReportLogic = createLogic({
  type: activityCommentReport.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To report the comment in activity (endpoint: /activity/comment/report) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { commentId, reportComment } = action.payload;

      const res = await momAxios.post("/activity/comment/report", {
        commentId,
        reportComment,
      });

      dispatch(
        activityCommentDeleteSuccess({ commentId, message: res.data.message })
      );
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        activityCommentReportFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [
  activityFetchLogic,
  toggleLikeLogic,
  activityFetchLvl1ComLogic,
  activityFetchLvl2ComLogic,
  activityAddComLogic,
  activityToggleComLikeLogic,
  statusFetchLogic,
  recommendedActivitiesLogic,
  activityDetailFetchLogic,
  activitiesViewsCountLogic,
  activityCommentDeleteLogic,
  activityCommentReportLogic,
];

import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";
import QueryString from "qs";

import {
  sleepRecentlyFetch,
  sleepRecentlyFetchSuccess,
  sleepRecentlyFetchFail,
  sleepRecommendFetch,
  sleepRecommendFetchsuccess,
  sleepRecommendFetchFail,
  sleepStoreHistory,
  sleepStoreHistorySuccess,
  sleepStoreHistoryFail,
  sleepDetailFetch,
  sleepDetailFetchFail,
  sleepDetailFetchSuccess,
  sleepToggleLike,
  sleepToggleLikeSuccess,
  sleepToggleLikeFail,
  sleepFetchExploreCategories,
  sleepFetchExploreCategoriesSuccess,
  sleepFetchExploreCategoriesFail,
  sleepFetchPlaylistCategories,
  sleepFetchPlaylistCategoriesSuccess,
  sleepFetchPlaylistCategoriesFail,
} from "./slice";

const sleepRecentlyFetchLogic = createLogic({
  type: sleepRecentlyFetch.type,
  latest: true,

  async process({ getState, momAxios, networkError, action }, dispatch, done) {
    crashlytics().log(
      "To fetch list of recently played sleeps (endpoint: /sleep/recentlyPlayed) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!selectedChildId) {
        dispatch(sleepRecentlyFetchSuccess([]));
        done();
        return;
      }

      const { payload } = action;

      const res = await momAxios.get("/sleep/recentlyPlayed", {
        params: {
          childId: selectedChildId,
          ...(!payload?.isDetail && { limit: 3 }),
        },
      });

      if (!payload?.isDetail)
        dispatch(sleepRecentlyFetchSuccess(res.data.data));
      else dispatch(sleepDetailFetchSuccess({ ...res.data }));
    } catch (err) {
      crashlytics().recordError(err);

      if (!action.payload?.isDetail) {
        dispatch(
          sleepRecentlyFetchFail(
            get(err, "response.data.error.message", err.message)
          )
        );
      } else {
        dispatch(
          sleepDetailFetchFail(
            get(err, "response.data.error.message", err.message)
          )
        );
      }

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sleepRecentlyFetch.type,
            payload: action.payload,
          })
        );
      }
    }
    done();
  },
});

const sleepRecommendLogic = createLogic({
  type: sleepRecommendFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching recommend sleeps for a particular sleep (endpoint: /sleep/recommendedSleep) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { _id, language } = action.payload;

      const res = await momAxios.get("/sleep/recommendedSleep", {
        params: { childId: selectedChildId, lullabyId: _id, language },
      });

      dispatch(sleepRecommendFetchsuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sleepRecommendFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        sleepRecommendFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const sleepStoreHistoryLogic = createLogic({
  type: sleepStoreHistory.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Updating the watch history status of specific sleep (endpoint: /sleep/store) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
        sleep: { selectedSong },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!selectedChildId) done();

      const { status } = action.payload;

      const res = await momAxios.post("/sleep/store", {
        childId: selectedChildId,
        dob: activechildDetails?.dob,
        id: selectedSong._id,
        status,
      });

      dispatch(sleepStoreHistorySuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(sleepStoreHistoryFail());
    }
    done();
  },
});

const sleepDetailFetchLogic = createLogic({
  type: sleepDetailFetch,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch detail list of sleeps (endpoint: /sleep) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { type, tags } = action.payload;

      if (type === "recentlyPlayed") {
        dispatch(sleepRecentlyFetch({ isDetail: true }));
        done();
        return;
      }

      let res;

      if (type === "likedSleep") {
        res = await momAxios.get("/sleep/likedSleep", {
          params: {
            childId: selectedChildId,
            dob: activechildDetails?.dob,
            tags,
          },
          paramsSerializer: (params) =>
            QueryString.stringify(params, { arrayFormat: "repeat" }),
        });
      } else {
        res = await momAxios.get("/sleep", {
          params: {
            childId: selectedChildId,
            dob: activechildDetails?.dob,
            tags,
          },
          paramsSerializer: (params) =>
            QueryString.stringify(params, { arrayFormat: "repeat" }),
        });
      }

      dispatch(sleepDetailFetchSuccess({ ...res.data }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        sleepDetailFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sleepDetailFetch.type,
            payload: action.payload,
          })
        );
      }
    }
    done();
  },
});

const sleepToggleLikeLogic = createLogic({
  type: sleepToggleLike.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Toggling the like in sleep (endpoint: /sleep/like) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!selectedChildId)
        throw new Error("First add atleast one child to like it");

      const { lullabyId } = action.payload;

      const res = await momAxios.post("/sleep/like", {
        childId: selectedChildId,
        id: lullabyId,
      });

      dispatch(
        sleepToggleLikeSuccess({
          lullabyId,
          ...res.data,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        sleepToggleLikeFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const sleepFetchExploreCategoriesLogic = createLogic({
  type: sleepFetchExploreCategories.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch list of explore categories sleeps (endpoint: /sleep/getSleepCategory) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/sleep/getSleepCategory", {
        params: {
          type: "explore",
        },
      });

      dispatch(sleepFetchExploreCategoriesSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        sleepFetchExploreCategoriesFail(
          get(err, "response.data.error.message", err.message)
        )
      );

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sleepFetchExploreCategories.type,
            payload: action.payload,
          })
        );
      }
    }
    done();
  },
});

const sleepFetchPlaylistCategoriesLogic = createLogic({
  type: sleepFetchPlaylistCategories.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch list of playlist categories sleeps (endpoint: /sleep/getSleepCategory) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/sleep/getSleepCategory", {
        params: {
          type: "playlist",
        },
      });

      dispatch(sleepFetchPlaylistCategoriesSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        sleepFetchPlaylistCategoriesFail(
          get(err, "response.data.error.message", err.message)
        )
      );

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sleepFetchPlaylistCategories.type,
            payload: action.payload,
          })
        );
      }
    }
    done();
  },
});

export default [
  sleepRecentlyFetchLogic,
  sleepRecommendLogic,
  sleepStoreHistoryLogic,
  sleepDetailFetchLogic,
  sleepToggleLikeLogic,
  sleepFetchExploreCategoriesLogic,
  sleepFetchPlaylistCategoriesLogic,
];

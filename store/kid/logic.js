import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
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
  recommendedVideoFetch,
  recommendedVideoFetchSuccess,
  recommendedVideoFetchFail,
  toggleVideoLike,
  toggleVideoLikeFail,
  toggleVideoLikeSuccess,
  updateKidWatchHistory,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";
import NetInfo from "@react-native-community/netinfo";

const sliderImageFetchLogic = createLogic({
  type: sliderImageFetch.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching slider images in kid screen 1 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/kid/getRecommendedVideos");

      dispatch(sliderImagesFetchSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: sliderImageFetch.type,
          })
        );
      }

      dispatch(
        sliderImagesFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const categoryFetchLogic = createLogic({
  type: categoryFetch.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching kid categories in kid screen 1 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/kid/getCategories");

      dispatch(categoryFetchSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: categoryFetch.type,
          })
        );
      }

      dispatch(
        categoryFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const specificCategoryFetchLogic = createLogic({
  type: specificCategoryFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching videos for specific category in kid screen 2 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const categoryTitle = action.payload;

      const res = await momAxios.get("/kid/getVideos", {
        params: {
          category: categoryTitle,
          childId: childrendata?._id,
          dob: childrendata?.dob,
        },
      });

      let data = res.data;
      let count = data.count;

      if (count > 0) {
        let LastUpdatedId = data.data[count - 1]._id;

        dispatch(
          specificCategoryFetchSuccess({
            kidcategoryVideos: data.data,
            LastUpdatedId,
            postReachedTillEnd: false,
          })
        );
      } else {
        dispatch(
          specificCategoryFetchSuccess({
            postReachedTillEnd: true,
          })
        );
      }
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: specificCategoryFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        specificCategoryFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const extraVideosFetchLogic = createLogic({
  type: extraVideosFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Fetching videos for specific category(pagination/infinite scrolling) in kid screen 2 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
        kid: { LastUpdatedId: offSetId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const categoryTitle = action.payload;

      const res = await momAxios.get("/kid/getVideos", {
        params: {
          category: categoryTitle,
          childId: selectedChildId,
          dob: childrendata?.dob,
          offSetId,
        },
      });

      const data = res.data;
      const count = data.count;

      if (count > 0) {
        const LastUpdatedId = data.data[count - 1]._id;

        dispatch(
          extraVideosFetchSuccess({
            kidcategoryVideos: data.data,
            LastUpdatedId,
            postReachedTillEnd: false,
          })
        );
      } else {
        dispatch(
          extraVideosFetchSuccess({
            postReachedTillEnd: true,
          })
        );
      }
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        extraVideosFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const kidVideoDetailFetchLogic = createLogic({
  type: videoDetailFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching details of specific video in kid screen 3 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
        kid: { videos },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const videoId = action.payload;

      let videDetail = videos.find((video) => video._id === videoId);

      if (!videDetail) {
        const childrendata = childrenDetails.find(
          (child) => child._id === selectedChildId
        );

        const res = await momAxios.get("/kid/getVideos", {
          params: {
            childId: childrendata?._id,
            dob: childrendata?.dob,
            videoId,
          },
        });

        videDetail = res.data;
      }

      if (videDetail) {
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable === false) {
          throw new Error(networkError);
        }
      }

      dispatch(videoDetailFetchSuccess(videDetail));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: videoDetailFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        videoDetailFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const kidRecommendedVideosLogic = createLogic({
  type: recommendedVideoFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching recommend videos in kid screen 3 (endpoint: /post/getPosts) (Logic)"
    );

    const { videoId, category, isHomeScreen } = action.payload;
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/kid/getRecommendedVideos", {
        params: { videoId, category },
      });

      dispatch(
        recommendedVideoFetchSuccess({ data: res.data.data, isHomeScreen })
      );
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: recommendedVideoFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        recommendedVideoFetchFail({
          error: get(err, "response.data.error.message", err.message),
          isHomeScreen,
        })
      );
    }
    done();
  },
});

const toggleKidVideoLikeLogic = createLogic({
  type: toggleVideoLike.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Toggling the like in kid screen 3 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );
      if (!parentId) throw new Error("Login to like the video");

      if (!childrendata)
        throw new Error("First add atleast one child to like the video");

      const videoId = action.payload;

      const res = await momAxios.post("/kid/likeVideo", {
        childId: childrendata._id,
        videoId,
      });

      dispatch(
        toggleVideoLikeSuccess({
          videoId,
          total_likes: res.data.total_likes,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleVideoLikeFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const updateKidWatchHistoryLogic = createLogic({
  type: updateKidWatchHistory.type,
  latest: true,

  async process({ getState, action, momAxios }, _, done) {
    crashlytics().log(
      "Updating the watch history status of specific video in kid screen 3 (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );
      if (!parentId) done();

      if (!childrendata) done();

      const { videoId, status } = action.payload;

      const res = await momAxios.post("kid/storeHistory", {
        childId: childrendata._id,
        dob: childrendata.dob,
        videoId,
        status,
      });
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

export default [
  sliderImageFetchLogic,
  categoryFetchLogic,
  specificCategoryFetchLogic,
  extraVideosFetchLogic,
  kidVideoDetailFetchLogic,
  kidRecommendedVideosLogic,
  toggleKidVideoLikeLogic,
  updateKidWatchHistoryLogic,
];

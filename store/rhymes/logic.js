import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  fetchRhymeVideos,
  fetchRhymeVideosSuccess,
  fetchRhymeVideosFail,
  fetchRhymeVideoDetail,
  fetchRhymeVideoDetailSuccess,
  fetchRhymeVideoDetailFail,
  fetchRecommendRhymeVideos,
  fetchRecommendRhymeVideosSuccess,
  fetchRecommendRhymeVideosFail,
  toggleRhymeVideoLike,
  toggleRhymeVideoLikeSuccess,
  toggleRhymeVideoLikeFail,
  updateCustomAudio,
  updateCustomAudioSuccess,
  updateCustomAudioFail,
  deleteCustomAudio,
  deleteCustomAudioFail,
  rhymesUpdateWatchHistory,
  rhymesUpdateWatchHistorySuccess,
} from "./slice";
import uploadFile from "../../src/utils/uploadFile";
import { addNoInternetAction } from "../auth/slice";

const fetchRhymeVideosLogic = createLogic({
  type: fetchRhymeVideos.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log("To fetch lullabies (endpoint: /rhyme) (Logic)");
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to view the lullabies");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const status = action.payload;

      const res = await momAxios.get("/rhyme", {
        params: {
          childId: childrendata?._id,
          dob: childrendata?.dob,
        },
      });

      dispatch(fetchRhymeVideosSuccess({ videos: res.data.data, status }));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchRhymeVideos.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        fetchRhymeVideosFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const fetchRhymeVideoDetailLogic = createLogic({
  type: fetchRhymeVideoDetail.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch details of specific rhyme (endpoint: /rhyme) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to view the rhyme");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const rhymeId = action.payload;

      const res = await momAxios.get("/rhyme", {
        params: {
          childId: childrendata?._id,
          dob: childrendata?.dob,
          rhymeId,
        },
      });

      dispatch(fetchRhymeVideoDetailSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchRhymeVideoDetail.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        fetchRhymeVideoDetailFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const fetchRecommendRhymeVideosLogic = createLogic({
  type: fetchRecommendRhymeVideos.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch recommend lullabies for specific rhyme (endpoint: /rhyme/recommendedRhyme) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to view the rhyme");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const { rhymeId, limit, isHomeScreen } = action.payload;

      const res = await momAxios.get("/rhyme/recommendedRhyme", {
        params: {
          childId: selectedChildId,
          dob: childrendata?.dob,
          limit: isHomeScreen ? (limit ? limit : 4) : null,
          rhymeId,
        },
      });

      dispatch(
        fetchRecommendRhymeVideosSuccess({
          data: res.data.data,
          isHomeScreen,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchRecommendRhymeVideos.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        fetchRecommendRhymeVideosFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const toggleRhymeVideoLikeLogic = createLogic({
  type: toggleRhymeVideoLike.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the like for specific rhyme (endpoint: /rhyme/like) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to like the video");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );
      if (!parentId) throw new Error("Login to like the audio");

      if (!childrendata)
        throw new Error("First Add atleast one child to like the audio");

      const rhymeId = action.payload;

      const res = await momAxios.post("/rhyme/like", {
        childId: childrendata._id,
        dob: childrendata.dob,
        rhymeId,
      });

      dispatch(
        toggleRhymeVideoLikeSuccess({
          rhymeId,
          no_of_likes: res.data.no_of_likes,
          isLiked: res.data.isLiked,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleRhymeVideoLikeFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const updateCustomAudioLogic = createLogic({
  type: updateCustomAudio.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "First uploading the custom audio and after that sending the mediaUrl (endpoint: /rhyme/updateCustomAudio) (Logic)"
    );
    try {
      const {
        auth: {
          parentId,
          selectedChildId,
          childrenDetails,
          refreshToken,
          firebaseToken,
          ttl,
        },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to record the audio");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      if (!childrendata)
        throw new Error("First Add atleast one child to record the audio");

      const { rhymeId, uri, duration } = action.payload;

      const refString = `rhyme/customAudio/parentId_${parentId}/${uri
        .split("/")
        .pop()}`;

      const attachmentDetail = await uploadFile({
        refreshToken,
        firebaseToken,
        ttl,
        refString,
        uri,
      });

      if (attachmentDetail.error)
        throw new Error("Error in uploading the file", {
          cause: attachmentDetail.error,
        });

      await momAxios.post("/rhyme/updateCustomAudio", {
        childId: selectedChildId,
        rhymeId,
        type: "update",
        audioUrl: attachmentDetail.mediaUrl,
        duration,
        fileType: attachmentDetail.fileType,
        filePath: attachmentDetail.filePath,
        audioSize: attachmentDetail.sizeInBytes,
      });

      dispatch(fetchRhymeVideoDetail(rhymeId));
      dispatch(updateCustomAudioSuccess());
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        updateCustomAudioFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const deleteCustomAudioLogic = createLogic({
  type: deleteCustomAudio.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To delete the mediaUrl for specific rhyme (endpoint: /rhyme/updateCustomAudio) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!childrenDetails)
        throw new Error("First Add atleast one child to delete the audio");
      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );
      if (!parentId) throw new Error("Login to delete the audio");

      if (!childrendata)
        throw new Error("First Add atleast one child to delete the audio");

      const { rhymeId, audioUrl } = action.payload;

      await momAxios.post("/rhyme/updateCustomAudio", {
        childId: childrendata._id,
        rhymeId,
        type: "delete",
        audioUrl,
      });

      dispatch(fetchRhymeVideoDetail(rhymeId));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        deleteCustomAudioFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const rhymesUpdateWatchHistoryLogic = createLogic({
  type: rhymesUpdateWatchHistory.type,
  // latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Updating the watch history status of specific ryhmes (endpoint: /rhyme/store) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (!parentId) done();

      if (!selectedChildId) done();

      const { rhymeId, status } = action.payload;

      await momAxios.post("/rhyme/store", {
        childId: activechildDetails._id,
        dob: activechildDetails.dob,
        rhymeId,
        status,
      });

      dispatch(rhymesUpdateWatchHistorySuccess(status));
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

export default [
  fetchRhymeVideosLogic,
  fetchRhymeVideoDetailLogic,
  fetchRecommendRhymeVideosLogic,
  toggleRhymeVideoLikeLogic,
  updateCustomAudioLogic,
  deleteCustomAudioLogic,
  rhymesUpdateWatchHistoryLogic,
];

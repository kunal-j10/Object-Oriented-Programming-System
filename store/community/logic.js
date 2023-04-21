import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";
import moment from "moment";

import {
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
  fetchLvl2Com,
  fetchLvl2ComSuccess,
  fetchLvl2ComFail,
  addLvlCom,
  addLvlComSuccess,
  addLvlComFail,
  toggleLvlComLike,
  toggleLvlComLikeSuccess,
  toggleLvlComLikeFail,
  fetchProfile,
  fetchProfileSuccess,
  fetchProfileFail,
  getQna,
  getQnaSuccess,
  getQnaFail,
  toggleFollow,
  toggleFollowSuccess,
  toggleFollowFail,
  createPost,
  createPostSuccess,
  createPostFail,
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
  expertViewsCount,
  expertReportfetch,
  expertReportfetchSuccess,
  expertReportfetchFailure,
  expertemptyReportBlockStatus,
  expertemptyReportBlockStatusSuccess,
  expertemptyReportBlockStatusFailure,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";
import uploadFile from "../../src/utils/uploadFile";

const fetchPostLogic = createLogic({
  type: fetchPost.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch posts for specific category (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { category } = action.payload;

      const res = await communityAxios.get("/post/getPosts", {
        params: { category },
      });

      if (res.data.count > 0) {
        let lastUpdatedDtm = res.data.data[res.data.count - 1].lastUpdatedDtm;

        dispatch(
          fetchPostSuccess({
            posts: res.data.data,
            lastUpdatedDtm,
            postReachedTillEnd: false,
          })
        );
      } else {
        dispatch(fetchPostSuccess({ postReachedTillEnd: true }));
      }
    } catch (err) {
      crashlytics().recordError(err);
      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({ type: fetchPost.type, payload: action.payload })
        );
      }

      dispatch(
        fetchPostFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const fetchExtraPostLogic = createLogic({
  type: fetchExtraPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To fetch posts (infinite scrolling/pagination) for specific category (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        community: { lastUpdatedDtm },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const category = action.payload;

      const res = await communityAxios.get("/post/getPosts", {
        params: { lastUpdatedDtm, category },
      });

      if (res.data.count > 0) {
        let lastUpdatedDtm = res.data.data[res.data.count - 1].lastUpdatedDtm;
        dispatch(
          fetchExtraPostSuccess({
            posts: res.data.data,
            lastUpdatedDtm,
            postReachedTillEnd: false,
          })
        );
      } else {
        dispatch(fetchExtraPostSuccess({ postReachedTillEnd: true }));
      }
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        fetchExtraPostFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const communityDetailFetchLogic = createLogic({
  type: communityDetail.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch posts for specific id (endpoint: /post/getPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        community: { posts },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { postId } = action.payload;

      const communityDetailFromPosts = posts.find((post) => post._id == postId);

      if (communityDetailFromPosts) {
        dispatch(
          communityDetailSuccess({
            post: communityDetailFromPosts,
          })
        );
      } else {
        const res = await communityAxios.get("/post/getPosts", {
          params: { postId },
        });

        dispatch(
          communityDetailSuccess({
            post: res.data.data[0],
          })
        );
      }
    } catch (err) {
      crashlytics().recordError(err);
      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({ type: fetchPost.type, payload: action.payload })
        );
      }

      dispatch(
        communityDetailFailure(
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

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the like for specific post (endpoint: /post/like) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const postId = action.payload;

      const res = await communityAxios.post("/post/like", { postId });

      dispatch(
        toggleLikeSuccess({
          postId,
          no_of_likes: res.data.no_of_likes,
          isLiked: res.data.isLiked,
          no_of_comments: res.data.no_of_comments,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleLikeFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const fetchLvl1ComLogic = createLogic({
  type: fetchLvl1Com.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch comments (Level 1 comment) for specific post (endpoint: /comment/getLevelOneComment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        community: { comLastUpdatedDtm },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { postId } = action.payload;

      const res = await communityAxios.get("/comment/getLevelOneComment", {
        params: {
          postId,
          lastUpdatedDtm: comLastUpdatedDtm,
        },
      });

      if (res.data.count > 0) {
        let comLastUpdatedDtm =
          res.data.data[res.data.count - 1].lastUpdatedDtm;
        dispatch(
          fetchLvl1ComSuccess({
            lvl1com: res.data.data,
            comLastUpdatedDtm,
            comReachedTillEnd: false,
          })
        );
      } else {
        dispatch(fetchLvl1ComSuccess({ comReachedTillEnd: true }));
      }
    } catch (err) {
      crashlytics().recordError(err);

      if (action.payload.status && err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchLvl1Com.type,
            payload: action.payload,
          })
        );
      }
      dispatch(
        fetchLvl1ComFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const fetchLvl2ComLogic = createLogic({
  type: fetchLvl2Com.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To fetch comments (Level 2 comment) for specific comment in that post (endpoint: /comment/getLevelTwoComment) (Logic)"
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

      const res = await communityAxios.get("/comment/getLevelTwoComment", {
        params: { commentId },
      });

      dispatch(
        fetchLvl2ComSuccess({
          lvl2com: res.data.data,
          lvl1ComId: commentId,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        fetchLvl2ComFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const addLvlComLogic = createLogic({
  type: addLvlCom.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To add comment (both level 1 & level 2 comment) for specific post (endpoint: /comment/addComment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
        community: { lvl1ComId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { postId, comment } = action.payload;

      const res = await communityAxios.post("/comment/addComment", {
        postId,
        comment,
        level1_comment_id: lvl1ComId,
      });

      dispatch(addLvlComSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        addLvlComFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const toggleLvlComLikeLogic = createLogic({
  type: toggleLvlComLike.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the like for specific comment (both level 1 & level 2 comment) (endpoint: /comment/like) (Logic)"
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

      const res = await communityAxios.post("/comment/like", { commentId });

      dispatch(
        toggleLvlComLikeSuccess({
          type: level1_comment_id ? "lvl2" : "lvl1",
          no_of_likes: res.data.no_of_likes,
          isLiked: res.data.isLiked,
          commentId,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleLvlComLikeFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const fetchProfileLogic = createLogic({
  type: fetchProfile.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch the expert profile (endpoint: /parent/getExpertProfile) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const expertId = action.payload;

      const res = await communityAxios.get("/parent/getExpertProfile", {
        params: { expertId },
      });

      dispatch(fetchProfileSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchProfile.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        fetchProfileFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const getQandALogic = createLogic({
  type: getQna.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch the questions and answers given by the specific expert (endpoint: /expertAnswers/{expertId}) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const expertId = action.payload;

      const res = await communityAxios.get(`/parent/expertAnswers/${expertId}`);

      dispatch(getQnaSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({ type: getQna.type, payload: action.payload })
        );
      }

      dispatch(
        getQnaFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const toggleFollowLogic = createLogic({
  type: toggleFollow.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To toggle the follow and un-follow for specific expert (endpoint: /parent/followExpert) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const status = action.payload.status;
      let boolean;
      if (status == "unfollow") {
        boolean = false;
      } else {
        boolean = true;
      }
      const expertId = action.payload.expertId;

      await communityAxios.post("/parent/followExpert", {
        expertId,
        type: status,
      });

      dispatch(toggleFollowSuccess(boolean));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        toggleFollowFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const createPostLogic = createLogic({
  type: createPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To create the new post or to ask the question (endpoint: /post/createQuery or /post/createNormalPost) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, refreshToken, firebaseToken, ttl },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const {
        endpoint,
        text,
        category,
        visibility,
        images,
        returnCategory,
        editPostId,
      } = action.payload;

      const imageList = [];
      const videoList = [];

      for (let index = 0; index < images.length; index++) {
        const { uri, fileName, filePath, fileType, fileSizeInBytes, type } =
          images[index];

        if (uri.startsWith("https://firebasestorage.googleapis.com/")) {
          if (
            fileType === "image/jpeg" ||
            fileType === "image/gif" ||
            fileType === "image/png" ||
            fileType === "image/jpg"
          ) {
            imageList.push({
              fileName,
              fileUrl: uri,
              filePath,
              fileType,
              fileSizeInBytes,
            });
          } else {
            videoList.push({
              fileName,
              fileUrl: uri,
              filePath,
              fileType,
              fileSizeInBytes,
            });
          }
        } else {
          const newFileName = uri.split("/").pop();
          const refString = `community/imagesAndVideos/parentId_${parentId}/${moment(
            new Date()
          ).format("YYYYMMDD_HHmmss_")}${newFileName}`;

          const attachmentDetail = await uploadFile({
            refreshToken,
            firebaseToken,
            ttl,
            refString,
            uri,
          });
          if (attachmentDetail.error)
            throw new Error("Error in uploading the image", {
              cause: attachmentDetail.error,
            });

          if (
            attachmentDetail.fileType === "image/jpeg" ||
            attachmentDetail.fileType === "image/gif" ||
            attachmentDetail.fileType === "image/png" ||
            attachmentDetail.fileType === "image/jpg"
          ) {
            imageList.push({
              fileName: attachmentDetail.fileName,
              fileUrl: attachmentDetail.mediaUrl,
              filePath: attachmentDetail.filePath,
              fileType: attachmentDetail.fileType,
              fileSizeInBytes: attachmentDetail.sizeInBytes,
            });
          } else {
            videoList.push({
              fileName: attachmentDetail.fileName,
              fileUrl: attachmentDetail.mediaUrl,
              filePath: attachmentDetail.filePath,
              fileType: attachmentDetail.fileType,
              fileSizeInBytes: attachmentDetail.sizeInBytes,
            });
          }
        }
      }

      await communityAxios.post(`/post/${endpoint}`, {
        childId: selectedChildId,
        text,
        category,
        visibility,
        postId: editPostId,
        imageList,
        videoList,
      });

      dispatch(fetchPost({ status: "loading", category: returnCategory }));
      dispatch(createPostSuccess());
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        createPostFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const deletePostLogic = createLogic({
  type: deletePost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log("To delete a post (endpoint: /post/deletePost) (Logic)");
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });
      const { postId } = action.payload;

      const res = await communityAxios.post(`/post/deletePost`, {
        postId,
      });

      dispatch(deletePostSuccess({ postId, message: res.data.message }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        deletePostFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const reportPostLogic = createLogic({
  type: reportPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log("To report a post (endpoint: /post/report) (Logic)");
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });
      const { postId, reportComment } = action.payload;

      const res = await communityAxios.post(`/post/report`, {
        postId,
        reportComment,
      });

      dispatch(reportPostSuccess({ message: res.data.message }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        reportPostFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const searchPostLogic = createLogic({
  type: searchPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log("To search a post (endpoint: /post/search) (Logic)");
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });
      const { searchKeyword } = action.payload;

      const res = await communityAxios.get("/post/search", {
        params: {
          q: searchKeyword,
        },
      });

      const posts = res.data.data;
      const count = res.data.count;

      dispatch(searchtPostSuccess({ posts, count }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        searchPostFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const emptysearchPostLogic = createLogic({
  type: emptySearchPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log("To clear search history (Logic)");
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });

      dispatch(emptySearchPostSucccess());
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        emptySearchPostFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const communityIncrementViewLogic = createLogic({
  type: communityIncrementViewCount.type,
  latest: true,

  async process({ getState, communityAxios }, dispatch, done) {
    crashlytics().log("To increment community view counts (Logic)");
    try {
      const {
        auth: { parentId, selectedChildId },
        community: { currViewedPostIds },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      await communityAxios.post(`/post/incViewsCount`, {
        postIds: currViewedPostIds,
      });

      dispatch(communityIncrementViewCountSuccess());
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

const communityFetchTrendingPostLogic = createLogic({
  type: communityFetchTrendingPost.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To fetch the trending posts in home screen (endpoint: /post/getTrendingPosts) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const limit = action.payload;

      const res = await communityAxios.get("/post/getTrendingPosts", {
        params: { limit },
      });

      dispatch(communityFetchTrendingPostSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        communityFetchTrendingPostFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const communityCommentDeleteLogic = createLogic({
  type: communityCommentDelete.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To delete the comment in community (endpoint: /comment/deleteComment) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { commentId, postId } = action.payload;

      const res = await communityAxios.post("/comment/deleteComment", {
        commentId,
        postId,
      });

      dispatch(
        communityCommentDeleteSuccess({ commentId, message: res.data.message })
      );
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        communityCommentDeleteFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const communityCommentReportLogic = createLogic({
  type: communityCommentReport.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To report the comment in community (endpoint: /comment/reportComment) (Logic)"
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

      const res = await communityAxios.post("/comment/reportComment", {
        commentId,
        reportComment,
      });

      dispatch(
        communityCommentReportSuccess({ commentId, message: res.data.message })
      );
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        communityCommentReportFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const expertViewsCountLogic = createLogic({
  type: expertViewsCount.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "To increment expert profile view count (endpoint: /parent/expertProfileViewCount) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const expertId = action.payload;

      await communityAxios.post(`/parent/expertProfileViewCount`, { expertId });
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

const expertReportfetchLogic = createLogic({
  type: expertReportfetch.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "Reporting an Expert (endpoint: /parent/reportExpert) (Logic)"
    );
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });
      if (!parentId) throw new Error("Login to update the profile ");

      const { expertId } = action.payload;

      const res = await communityAxios.post(`parent/reportExpert`, {
        expertId,
      });

      dispatch(expertReportfetchSuccess(res.data.message));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        expertReportfetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const expertemptyReportBlockStatusLogic = createLogic({
  type: expertemptyReportBlockStatus.type,
  latest: true,

  async process({ getState, action, communityAxios }, dispatch, done) {
    crashlytics().log(
      "Reporting/Blocking a user (endpoint: /parent/type) (Logic)"
    );
    try {
      const {
        auth: { parentId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
      });
      if (!parentId) throw new Error("Login to update the profile ");

      dispatch(expertemptyReportBlockStatusSuccess());
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(expertemptyReportBlockStatusFailure());
    }
    done();
  },
});

export default [
  fetchPostLogic,
  fetchExtraPostLogic,
  toggleLikeLogic,
  fetchLvl1ComLogic,
  fetchLvl2ComLogic,
  addLvlComLogic,
  toggleLvlComLikeLogic,
  fetchProfileLogic,
  getQandALogic,
  toggleFollowLogic,
  createPostLogic,
  deletePostLogic,
  reportPostLogic,
  searchPostLogic,
  emptysearchPostLogic,
  communityDetailFetchLogic,
  communityIncrementViewLogic,
  communityFetchTrendingPostLogic,
  communityCommentDeleteLogic,
  communityCommentReportLogic,
  expertViewsCountLogic,
  expertReportfetchLogic,
  expertemptyReportBlockStatusLogic,
];

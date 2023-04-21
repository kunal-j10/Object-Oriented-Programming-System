import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";
import moment from "moment";

import {
  parentprofileDetailsfecth,
  parentprofileDetailsfecthSuccess,
  parentprofileDetailsfecthFailure,
  contentfetch,
  contentfetchSuccess,
  contentfetchFailure,
  parentReportBlockfetch,
  parentReportBlockfetchSuccess,
  parentReportBlockfetchFailure,
  emptyReportBlockStatus,
  emptyReportBlockStatusSuccess,
  emptyReportBlockStatusFailure,
} from "./slice";

const parentprofileDetailsfecthLogic = createLogic({
  type: parentprofileDetailsfecth.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch parent profile details for specific parent (endpoint: /post/getParentProfileStat) (Logic)"
    );

    try {
      const { parentId } = action.payload;

      const res = await communityAxios.get("post/getParentProfileStat", {
        params: {
          parentId,
        },
      });

      dispatch(parentprofileDetailsfecthSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: parentprofileDetailsfecth.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        parentprofileDetailsfecthFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const contentfetchLogic = createLogic({
  type: contentfetch.type,
  latest: true,

  async process(
    { getState, action, communityAxios, networkError },
    dispatch,
    done
  ) {
    crashlytics().log(
      "To fetch parent post for specific parent (endpoint: /post/getPosts) (Logic)"
    );

    try {
      const { parentId, type } = action.payload;

      if (type == "posts") {
        const res = await communityAxios.get("post/getPosts", {
          params: {
            postType: "normal",
            parentId,
          },
        });
        dispatch(contentfetchSuccess(res.data));
      } else if (type == "queries") {
        const res = await communityAxios.get("post/getPosts", {
          params: {
            postType: "query",
            parentId,
          },
        });
        dispatch(contentfetchSuccess(res.data));
      } else {
        const res = await communityAxios.get("post/getPosts", {
          params: {
            postType: "query",
            parentId,
            expertAnswered: true,
          },
        });
        dispatch(contentfetchSuccess(res.data));
      }
    } catch (err) {
      crashlytics().recordError(err);
      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: contentfetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        contentfetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const parentReportBlockfetchLogic = createLogic({
  type: parentReportBlockfetch.type,
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

      const { type, Id } = action.payload;
      const res = await communityAxios.post(`parent/${type}`, {
        parentId: Id,
      });
      dispatch(parentReportBlockfetchSuccess(res.data.message));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        parentReportBlockfetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const emptyReportBlockStatusLogic = createLogic({
  type: emptyReportBlockStatus.type,
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

      dispatch(emptyReportBlockStatusSuccess());
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(emptyReportBlockStatusFailure());
    }
    done();
  },
});


export default [
  parentprofileDetailsfecthLogic,
  contentfetchLogic,
  parentReportBlockfetchLogic,
  emptyReportBlockStatusLogic,
];

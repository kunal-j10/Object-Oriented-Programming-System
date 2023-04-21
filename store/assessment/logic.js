import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  assessmentFetch,
  assessmentFetchFail,
  assessmentFetchSuccess,
  changeStatus,
  changeStatusSuccess,
  changeStatusFail,
  assessmentDetailFetch,
  assessmentDetailFetchSuccess,
  assessmentDetailFetchFail,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";

const assessmentFetchLogic = createLogic({
  type: assessmentFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch assessments of specific category (endpoint: /assessment) (Logic)"
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
        throw new Error("First Add atleast one child to view the assessment");

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      if (!parentId) throw new Error("Login to view the assessment");

      if (!childrendata)
        throw new Error("First Add atleast one child to view the assessment");

      const category = action.payload;

      const res = await momAxios.get("/assessment", {
        params: { childId: childrendata._id, dob: childrendata.dob, category },
      });

      dispatch(assessmentFetchSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: assessmentFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        assessmentFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const assessmentChangeStatusLogic = createLogic({
  type: changeStatus.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "To change the status and also to save the note for specific assessment (endpoint: /assessment/store) (Logic)"
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

      const { id, status, note } = action.payload;

      const res = await momAxios.post("/assessment/store", {
        childId: childrendata._id,
        assessmentId: id,
        dob: childrendata.dob,
        status,
        note,
      });

      const data = res.data;

      dispatch(
        changeStatusSuccess({ id, status: data.status, note: data.note })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        changeStatusFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const assessmentDetailFetchLogic = createLogic({
  type: assessmentDetailFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch the details of specific assessment (endpoint: /assessment) (Logic)"
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

      const assessmentId = action.payload;

      const res = await momAxios.get("/assessment", {
        params: {
          childId: childrendata._id,
          dob: childrendata.dob,
          assessmentId,
        },
      });

      dispatch(assessmentDetailFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: assessmentDetailFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        assessmentDetailFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [
  assessmentFetchLogic,
  assessmentChangeStatusLogic,
  assessmentDetailFetchLogic,
];

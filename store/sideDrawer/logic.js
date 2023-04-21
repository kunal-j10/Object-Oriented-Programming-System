import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  fetchFAqs,
  fetchFAqsSuccess,
  fetchFAqsFailure,
  fetchContactUsDetails,
  fetchContactUsDetailsSuccess,
  fetchContactUsDetailsFailure,
  fetchFeedbackDetails,
  fetchFeedbackDetailsSuccess,
  fetchFeedbackDetailsFailure,
} from "./slice";

import { addNoInternetAction } from "../auth/slice";
import NetInfo from "@react-native-community/netinfo";

const fetchFAqsLogic = createLogic({
  type: fetchFAqs.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching FAqs in FAQs screen (endpoint: /misc/getFAQ) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/misc/getFAQ");

      dispatch(fetchFAqsSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: fetchFAqs.type,
          })
        );
      }

      dispatch(
        fetchFAqsFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const fetchContactUsDetailsLogic = createLogic({
  type: fetchContactUsDetails.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      `Contact us feedback (endpoint: /misc/contactUs) (Logic)`
    );
    try {
      const {
        auth: { parentId, accessToken, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { fullName, email, message } = action.payload;

      let requestBody = {
        fullName,
        email,
        message,
      };

      const res = await momAxios.post("/misc/contactUs", requestBody, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(fetchContactUsDetailsSuccess(res.data.message));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        fetchContactUsDetailsFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const fetchFeedbackDetailsLogic = createLogic({
  type: fetchFeedbackDetails.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(`Feedback Details (endpoint: /misc/feedback) (Logic)`);
    try {
      const {
        auth: { parentId, accessToken, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { rating, feedback } = action.payload;

      let requestBody = {
        rating,
        feedback,
      };

      const res = await momAxios.post("/misc/feedback", requestBody, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(fetchFeedbackDetailsSuccess(res.data.message));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        fetchFeedbackDetailsSuccess(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [
  fetchFAqsLogic,
  fetchContactUsDetailsLogic,
  fetchFeedbackDetailsLogic,
];

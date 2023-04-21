import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import { addNoInternetAction } from "../auth/slice";
import {
  growthWeightFetch,
  growthWeightFetchSuccess,
  growthWeightFetchFail,
  growthHeightFetch,
  growthHeightFetchSuccess,
  growthHeightFetchFail,
  growthHeadFetch,
  growthHeadFetchSuccess,
  growthHeadFetchFail,
  growthAddDetails,
  growthAddDetailsSuccess,
  growthAddDetailsFail,
} from "./slice";

const growthWeightFetchLogic = createLogic({
  type: growthWeightFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch growth weight data (endpoint: /growth/getWeight) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/growth/getWeight", {
        params: {
          childId: selectedChildId,
          dob: activechildDetails.dob,
          minAge:
            activechildDetails.ageInMonths - 7 < 0
              ? 0
              : activechildDetails.ageInMonths - 7,
          maxAge: activechildDetails.ageInMonths + 7,
          gender: activechildDetails.gender,
        },
      });

      dispatch(growthWeightFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: growthWeightFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        growthWeightFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const growthHeightFetchLogic = createLogic({
  type: growthHeightFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch growth height data (endpoint: /growth/getHeight) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/growth/getHeight", {
        params: {
          childId: selectedChildId,
          dob: activechildDetails.dob,
          minAge:
            activechildDetails.ageInMonths - 7 < 0
              ? 0
              : activechildDetails.ageInMonths - 7,
          maxAge: activechildDetails.ageInMonths + 7,
          gender: activechildDetails.gender,
        },
      });

      dispatch(growthHeightFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: growthHeightFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        growthHeightFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const growthHeadFetchLogic = createLogic({
  type: growthHeadFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To fetch growth head data (endpoint: /growth/getHeadCircle) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, activechildDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/growth/getHeadCircle", {
        params: {
          childId: selectedChildId,
          dob: activechildDetails.dob,
          minAge:
            activechildDetails.ageInMonths - 7 < 0
              ? 0
              : activechildDetails.ageInMonths - 7,
          maxAge: activechildDetails.ageInMonths + 7,
          gender: activechildDetails.gender,
        },
      });

      dispatch(growthHeadFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: growthHeadFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        growthHeadFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const growthAddDetailsLogic = createLogic({
  type: growthAddDetails.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "To add growth details (endpoint: /growth/addGrowthData) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const {
        weight,
        height,
        head: headCircle,
        date: dateAtRecorded,
        type,
        docId,
      } = action.payload;

      const res = await momAxios.post("/growth/addGrowthData", {
        childId: selectedChildId,
        weight,
        height,
        headCircle,
        dateAtRecorded,
        type: type[0].toLowerCase() + type.slice(1), // Weight, Height, HeadCircle => weight, height, headCircle
        docId,
      });

      dispatch(growthAddDetailsSuccess());

      if (type === "Weight") {
        dispatch(growthWeightFetch("loading"));
      } else if (type === "Height") {
        dispatch(growthHeightFetch("loading"));
      } else {
        dispatch(growthHeadFetch("loading"));
      }
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: growthAddDetails.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        growthAddDetailsFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [
  growthWeightFetchLogic,
  growthHeightFetchLogic,
  growthHeadFetchLogic,
  growthAddDetailsLogic,
];

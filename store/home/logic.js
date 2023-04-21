import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  homeSliderfetch,
  homeSliderfetchSuccess,
  homeSliderfetchFailure,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";

const homeSliderfetchLogic = createLogic({
  type: homeSliderfetch.type,
  latest: true,

  async process({ getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching slider images in home screen (endpoint: /home/getPosters) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const res = await momAxios.get("/home/getPosters");

      dispatch(homeSliderfetchSuccess(res.data.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: homeSliderfetch.type,
          })
        );
      }

      dispatch(
        homeSliderfetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});
export default [homeSliderfetchLogic];

import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {
  dynamicLinkFetch,
  dynamicLinkFetchSuccess,
  dynamicLinkFetchFailure,
} from "./slice";

const dynamicLinkFetchLogic = createLogic({
  type: dynamicLinkFetch.type,
  latest: true,

  async process({ getState,action }, dispatch, done) {
    crashlytics().log("Creating Dynamic Link");
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });
      const {param1,value1,param2,value2} = action.payload;

      const link =  await dynamicLinks().buildShortLink({
          link: `https://www.adwaitaeducare.com?${param1}=${value1}&${param2}=${value2}`,
          domainUriPrefix: 'https://adwaitaeducare.page.link',
          ios: {
            bundleId: "com.adwaitaeducare.parenting",
            appStoreId: "<appstore_id>",
          },
          android: {
            packageName: "com.adwaitaeducare.parenting",
          },
        });
      dispatch(dynamicLinkFetchSuccess({link:link,screen:value1}));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        dynamicLinkFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [dynamicLinkFetchLogic];

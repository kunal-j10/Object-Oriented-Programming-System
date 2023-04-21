import dynamicLinks from "@react-native-firebase/dynamic-links";
import crashlytics from "@react-native-firebase/crashlytics";
import { getPathFromState } from "@react-navigation/native";

import { deepLinkConfig } from "./linking";
import config from "../../constants/config.json";

export const getDynamicLink = async ({
  state,
  isCommunity,
  selectedPostId,
}) => {
  try {
    let stateLink;
    if (isCommunity) {
      stateLink = `/community/post?selectedPostId=${selectedPostId}`;
    } else {
      stateLink = getPathFromState(state, deepLinkConfig);
    }

    let domainUriPrefix = config.domainUriPrefix;

    const link = await dynamicLinks().buildShortLink({
      link: `https://www.adwaitaeducare.com${stateLink}`,
      domainUriPrefix: domainUriPrefix,
      ios: {
        bundleId: "com.adwaitaeducare.parenting",
        appStoreId: "<appstore_id>",
      },
      android: {
        packageName: "com.adwaitaeducare.parenting",
      },
    });

    return link;
  } catch (err) {
    crashlytics().recordError(err);
  }
};

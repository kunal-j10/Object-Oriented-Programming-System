import { Linking } from "react-native";
import { utils } from "@react-native-firebase/app";
import dynamicLinks from "@react-native-firebase/dynamic-links";

export const deepLinkConfig = {
  // Deep link configuration
  screens: {
    DrawerNavigator: {
      screens: {
        TabNavigator: {
          screens: {
            CommunityScreen: {
              path: "community",
              initialRouteName: "Community",
              screens: {
                Comments: "post",
              },
            },
            Kid: {
              path: "kid",
              initialRouteName: "KidStack",
              screens: {
                VideoDetail: "video",
              },
            },
            MomNavigator: {
              initialRouteName: "Mom",
              screens: {
                ActivitiesNavigator: {
                  path: "activities",
                  initialRouteName: "Activities",
                  screens: {
                    ActivityContent: "activityDetail",
                  },
                },
                LullabyRhymesNavigator: {
                  path: "rhymes",
                  initialRouteName: "LullabyRhymes",
                  screens: {
                    RhymesVideoDetail: "video",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default linking = {
  prefixes: [
    "https://www.adwaitaeducare.com",
    "https://adwaitaeducare.page.link",
  ],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, you would need to get the initial URL from your third-party integration
    // The exact usage depend on the third-party SDK you use
    // For example, to get to get the initial URL for Firebase Dynamic Links:
    const { isAvailable } = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        return initialLink.url;
      }
    }

    // As a fallback, you may want to do the default deep link handling
    const url = await Linking.getInitialURL();

    return url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // Listen to incoming links from Firebase Dynamic Links
    const unsubscribeFirebase = dynamicLinks().onLink(({ url }) => {
      listener(url);
    });

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      unsubscribeFirebase();
      linkingSubscription.remove();
    };
  },

  config: deepLinkConfig,
};

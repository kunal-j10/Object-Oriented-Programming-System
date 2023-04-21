export const isAuthenticatedSelector = (state) => state.auth.isAuthenticated;

export const authLoadingSelector = (state) => state.auth.authLoading;

export const authErrorSelector = (state) => state.auth.error;

export const isFirstTimeSelector = (state) => state.auth.isFirstTime;

export const accessTokenSelector = (state) => state.auth.accessToken;

export const refreshTokenSelector = (state) => state.auth.refreshToken;

export const ttlSelector = (state) => state.auth.ttl;

export const parentIdSelector = (state) => state.auth.parentId;

export const userNameSelector = (state) => state.auth.name;

export const userPhoneSelector = (state) => state.auth.phoneNumber;

export const userEmailSelector = (state) => state.auth.email;

export const userColorSelector = (state) => state.auth.color;

export const userNamingInitialsSelector = (state) => state.auth.nameinitials;

export const childrenDetailsSelector = (state) => state.auth.childrenDetails;

export const selectedChildIdSelector = (state) => state.auth.selectedChildId;

export const otpGeneratedSelector = (state) => state.auth.otpGenerated;

export const authSuccessMessageSelector = (state) => state.auth.successMessage;

export const parentDetailsSelector = (state) => state.auth.parentDetails;

export const selectedChildDetailsSelector = (state) =>
  state.auth.activechildDetails;

export const selectedChildDetailsLaodingSelector = (state) =>
  state.auth.activechildDetailsLoading;

export const selectedChildAgeinMonths = (state) =>
  state.auth.activechildDetails?.ageInMonths;

export const retryActionsSelector = (state) => state.auth.actionTypes;

export const refreshFailedSelector = (state) => state.auth.refreshFailed;

export const parentChildAddedSelector = (state) => state.auth.parentChildAdded;

export const authIsSignUpThroughGoogleSelector = (state) =>
  state.auth.isSignUpThroughGoogle;

export const authSignUpGoogleNameSelector = (state) =>
  state.auth.signUpGoogleName;

export const authSignUpGoogleEmailSelector = (state) =>
  state.auth.signUpGoogleEmail;

  export const parentDetailIsrefreshing = (state) =>
  state.auth.parentDetailsIsrefreshing;

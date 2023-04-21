export const profileDetailSelector = (state) => state.parentProfile.parentProfileDetails

export const profileDetailLoadingSelector = (state) => state.parentProfile.isProfileLoading

export const contentSelector = (state) => state.parentProfile.content

export const contentLoadingSelector = (state) => state.parentProfile.contentLoading

export const parentBlockReportLoading = (state) =>
  state.parentProfile.parentBlockReportLoading;

export const parentBlockReportStatus = (state) =>
  state.parentProfile.parentBlockReportStatus;




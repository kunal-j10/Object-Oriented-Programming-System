export const vaccinesSelector = (state) => state.vaccination.vaccines;

export const homeVaccinesSelector = (state) => state.vaccination.homeVaccines;

export const vaccinationIsLoadingSelector = (state) =>
  state.vaccination.isLoading;

export const vaccinationIsRefreshingSelector = (state) =>
  state.vaccination.isRefreshing;

export const vaccinationIsUploadingSelector = (state) =>
  state.vaccination.isUploading;

export const vaccinationIsUploadedSelector = (state) =>
  state.vaccination.isUploaded;

export const vaccinationErrorDisplaySelector = (state) =>
  state.vaccination.errorDisplay;

export const vaccinationErrorSelector = (state) => state.vaccination.error;

export const healthDriveSelector = (state) => state.health.drive;

export const healthFolderQueueSelector = (state) => state.health.folderQueue;

export const healthFolderIdSelector = (state) => state.health.folderId;

export const healthIsRefreshingSelector = (state) => state.health.isRefreshing;

export const healthIsLoadingSelector = (state) => state.health.isLoading;

export const healthIsUploadingSelector = (state) => state.health.isUploading;

export const healthIsUploadedSelector = (state) => state.health.isUploaded;

export const healthSuccessMessageSelector = (state) =>
  state.health.successMessage;

export const healthErrorListSelector = (state) => state.health.errorList;

export const healthErrorSelector = (state) => state.health.error;

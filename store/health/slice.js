import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drive: [],
  folderQueue: [],
  folderId: null,
  isRefreshing: false,
  isLoading: false,
  isUploading: false,
  isUploaded: false,
  successMessage: "",
  errorList: "",
  error: "",
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    healthStorageFetch(state, { payload }) {
      if (payload === "loading") {
        state.isLoading = true;
      } else if (payload === "refreshing") {
        state.isRefreshing = true;
      }
    },
    healthStorageFetchSuccess(state, { payload }) {
      state.drive = payload;
      state.isLoading = false;
      state.isRefreshing = false;
    },
    healthStorageFetchFail(state, { payload }) {
      state.drive = [];
      state.isLoading = false;
      state.isRefreshing = false;
      state.errorList = payload;
    },
    healthCreateFolder(state) {
      state.isLoading = true;
    },
    healthCreateFolderSuccess(state, { payload }) {
      let index;
      for (index = state.drive.length - 1; index >= 0; index--) {
        if (state.drive[index].type === "folder") break;
      }
      state.drive.splice(index + 1, 0, payload);
      state.isLoading = false;
    },
    healthCreateFolderFail(state, { payload }) {
      state.error = payload;
      state.isLoading = false;
    },
    healthUploadFile(state) {
      state.isUploading = true;
    },
    healthUploadFileSuccess(state, { payload }) {
      state.drive.push(payload);
      state.isUploading = false;
      state.isUploaded = true;
    },
    healthUploadFileFail(state, { payload }) {
      state.isUploading = false;
      state.isUploaded = false;
      state.error = payload;
    },
    healthDelFileOrFol(state, { payload }) {
      state.isLoading = true;
    },
    healthDelFileOrFolSuccess(state, { payload }) {
      state.isLoading = false;
      state.successMessage = payload.message;
    },
    healthDelFileOrFolFail(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
    },
    healthAddFolder(state, { payload }) {
      state.folderQueue.push(payload);
      state.folderId = payload._id;
    },
    healthRemoveFolder(state, { payload }) {
      if (payload) {
        folderIdx = state.folderQueue.findIndex((item) => item._id === payload);
        if (folderIdx !== state.folderQueue.length - 1) {
          state.folderQueue.splice(folderIdx + 1);
        }
      } else {
        state.folderQueue.pop();
      }
      state.folderId = state.folderQueue[state.folderQueue.length - 1]?._id;
    },
    healthRename(state) {
      state.isLoading = true;
    },
    healthRenameSuccess(state, { payload }) {
      const renameDocIndex = state.drive.findIndex(
        (item) => item._id === payload.renameDocId
      );
      if (state.drive[renameDocIndex].type === "folder") {
        state.drive[renameDocIndex].name = payload.folderName;
      } else {
        state.drive[renameDocIndex].name =
          payload.folderName +
          "." +
          state.drive[renameDocIndex].name.split(".").pop();
      }
      state.isLoading = false;
    },
    healthRenameFail(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
    },
    healthChangeIsUploaded(state) {
      state.isUploaded = false;
    },
    healthRemoveSuccessMes(state) {
      state.successMessage = "";
    },
    healthRemoveError(state) {
      state.error = "";
    },
  },
});

export const {
  healthStorageFetch,
  healthStorageFetchSuccess,
  healthStorageFetchFail,
  healthCreateFolder,
  healthCreateFolderSuccess,
  healthCreateFolderFail,
  healthUploadFile,
  healthUploadFileSuccess,
  healthUploadFileFail,
  healthDelFileOrFol,
  healthDelFileOrFolSuccess,
  healthDelFileOrFolFail,
  healthAddFolder,
  healthRemoveFolder,
  healthRename,
  healthRenameSuccess,
  healthRenameFail,
  healthChangeIsUploaded,
  healthRemoveSuccessMes,
  healthRemoveError,
} = healthSlice.actions;

export default healthSlice.reducer;

import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
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
  healthRename,
  healthRenameSuccess,
  healthRenameFail,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";

import uploadFile from "../../src/utils/uploadFile";

const healthStorageFetchLogic = createLogic({
  type: healthStorageFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching folders and files in health section (endpoint: /healthStorage/getFoldersNFiles) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
        health: { folderId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (childrenDetails?.length === 0) {
        throw new Error("First Add atleast one child to view the files!!");
      }

      const res = await momAxios.get("/healthStorage/getFoldersNFiles", {
        params: { folderId, childId: selectedChildId },
      });

      dispatch(healthStorageFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: healthStorageFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        healthStorageFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const healthCreateFolderLogic = createLogic({
  type: healthCreateFolder.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Creating folder in health section (endpoint: /healthStorage/createFolderOrUploadFile) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
        health: { folderId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (childrenDetails?.length === 0) {
        throw new Error("First Add atleast one child to create the folder!!");
      }

      const name = action.payload;

      const res = await momAxios.post(
        "/healthStorage/createFolderOrUploadFile",
        {
          childId: selectedChildId,
          type: "folder",
          topFolderId: folderId,
          name,
        }
      );

      dispatch(healthCreateFolderSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        healthCreateFolderFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const healthUploadFileLogic = createLogic({
  type: healthUploadFile.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Uploading file in health section (endpoint: /healthStorage/createFolderOrUploadFile) (Logic)"
    );
    try {
      const {
        auth: {
          parentId,
          selectedChildId,
          childrenDetails,
          refreshToken,
          firebaseToken,
          ttl,
        },
        health: { folderId, folderQueue },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      if (childrenDetails?.length === 0) {
        throw new Error("First Add atleast one child to upload the file!!");
      }

      let { name, uri, fileType } = action.payload;

      if (fileType.startsWith("image/")) {
        fileType = "image";
      } else if (fileType === "application/pdf") {
        fileType = "pdf";
      }

      let refString = `healthStorage/parentId_${parentId}/childId_${selectedChildId}/`;

      for (let index = 0; index < folderQueue.length; index++) {
        refString +=
          folderQueue[index].name + "_" + folderQueue[index]._id + "/";
      }
      refString += name;

      const attachmentDetail = await uploadFile({
        refreshToken,
        firebaseToken,
        ttl,
        refString,
        uri,
      });

      if (attachmentDetail.error)
        throw new Error("Error in uploading the file", {
          cause: attachmentDetail.error,
        });

      const res = await momAxios.post(
        "/healthStorage/createFolderOrUploadFile",
        {
          childId: selectedChildId,
          type: "file",
          topFolderId: folderId,
          name,
          fileUrl: attachmentDetail.mediaUrl,
          fileType: attachmentDetail.fileType + "--" + fileType,
          fileSizeInBytes: attachmentDetail.sizeInBytes,
          filePath: attachmentDetail.filePath,
        }
      );

      dispatch(healthUploadFileSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        healthUploadFileFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const healthDelFileOrFolLogic = createLogic({
  type: healthDelFileOrFol.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Deleting file or folder in health section (endpoint: /healthStorage/deleteFileAndFolder) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const docId = action.payload;

      const res = await momAxios.post("/healthStorage/deleteFileAndFolder", {
        docId,
      });

      dispatch(healthDelFileOrFolSuccess(res.data));
      dispatch(healthStorageFetch("loading"));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        healthDelFileOrFolFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const healthRenameLogic = createLogic({
  type: healthRename.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Renaming file or folder in health storage (endpoint: /healthStorage/rename) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { renameDocId, folderName } = action.payload;

      await momAxios.patch("/healthStorage/rename", {
        docId: renameDocId,
        name: folderName,
      });

      dispatch(healthRenameSuccess(action.payload));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        healthRenameFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

export default [
  healthStorageFetchLogic,
  healthCreateFolderLogic,
  healthUploadFileLogic,
  healthDelFileOrFolLogic,
  healthRenameLogic,
];

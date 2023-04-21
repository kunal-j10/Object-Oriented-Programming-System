import { createLogic } from "redux-logic";
import { get } from "lodash";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  parentProfilePicFetch,
  parentProfilePicFetchSuccess,
  parentProfilePicFetchFailure,
  parentEditFetch,
  parentEditFetchSuccess,
  parentEditFetchFailure,
  parentEditPasswordFetch,
  parentEditPasswordSuccess,
  parentEditPasswordFailure,
  childEditFetch,
  childEditFetchSuccess,
  childEditFetchFailure,
  profileSectionFetch,
  profileSectionChange,
  childProfilePicFetch,
  childProfilePicFetchSuccess,
  childProfilePicFetchFailure,
} from "./slice";
import uploadFile from "../../src/utils/uploadFile";

const parentProfilePicFetchLogic = createLogic({
  type: parentProfilePicFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Updating parent profile pic (endpoint: /parent/updateParentProfile) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId, refreshToken, firebaseToken, ttl },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const profilePicUrl = action.payload;

      const refString = `parentProfileImgs/parentId_${parentId}/${profilePicUrl
        .split("/")
        .pop()}`;

      const attachmentDetail = await uploadFile({
        refreshToken,
        firebaseToken,
        ttl,
        refString,
        uri: profilePicUrl,
      });

      if (attachmentDetail.error)
        throw new Error("Error in uploading the file", {
          cause: attachmentDetail.error,
        });

      await momAxios.post("/parent/updateParentProfile", {
        profileImageUrl: attachmentDetail.mediaUrl,
      });

      dispatch(parentProfilePicFetchSuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        parentProfilePicFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const childProfilePicFetchLogic = createLogic({
  type: childProfilePicFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Updating child profile pic (endpoint: /parent/updateChildDetails/) (Logic)"
    );
    try {
      const {
        auth: { parentId, refreshToken, firebaseToken, ttl },
      } = getState();
      const profilePicUrl = action.payload.path;
      const childId = action.payload.id;
      crashlytics().setAttributes({
        parentId,
        childId,
      });

      const refString = `childProfileImgs/parentId_${parentId}/childId_${childId}/${profilePicUrl
        .split("/")
        .pop()}`;

      const attachmentDetail = await uploadFile({
        refreshToken,
        firebaseToken,
        ttl,
        refString,
        uri: profilePicUrl,
      });

      if (attachmentDetail.error)
        throw new Error("Error in uploading the file", {
          cause: attachmentDetail.error,
        });

      await momAxios.post(`/parent/updateChildDetails/${childId}`, {
        profileImageUrl: attachmentDetail.mediaUrl,
      });

      dispatch(childProfilePicFetchSuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        childProfilePicFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const parentEditFetchLogic = createLogic({
  type: parentEditFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Updating parent profile data (endpoint: /parent/updateParentProfile) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });
      if (!parentId) throw new Error("Login to update the profile ");

      const EditedProfile = action.payload;

      let response = await momAxios.post("/parent/updateParentProfile", {
        name: EditedProfile.name,
        email: EditedProfile.email,
        dob: EditedProfile.dob,
        gender: EditedProfile.gender,
      });

      dispatch(parentEditFetchSuccess(response.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        parentEditFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const childEditFetchLogic = createLogic({
  type: childEditFetch.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    const EditedProfile = action.payload;
    crashlytics().log(
      `Updating child profile data (endpoint: /parent/updateChildDetails/${EditedProfile.id}) (Logic)`
    );
    try {
      const {
        auth: { parentId, childrenDetails, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });
      if (!parentId) throw new Error("Login to update the profile ");
      if (!childrenDetails)
        throw new Error("First Add atleast one child to record the audio");

     const res = await momAxios.post(`/parent/updateChildDetails/${EditedProfile.id}`, {
        name: EditedProfile.name,
        dob: EditedProfile.dob,
        gender: EditedProfile.gender,
      });

      dispatch(childEditFetchSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        childEditFetchFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const parentEditPasswordFetchLogic = createLogic({
  type: parentEditPasswordFetch.type,
  latest: true,

  async process({ getState, action, authAxios }, dispatch, done) {
    crashlytics().log(
      `Updating parent profile password (endpoint: /parent/changePassWithCurrPass) (Logic)`
    );
    try {
      const {
        auth: { parentId, accessToken, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });
      if (!parentId) throw new Error("Login to update the profile ");

      const currentPassword = action.payload.password;
      const changedPassword = action.payload.changePassword;

      let requestBody = {
        currPassword: currentPassword,
        newPassword: changedPassword,
      };

      const res = await authAxios.post(
        "/parent/changePassWithCurrPass",
        requestBody,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      dispatch(parentEditPasswordSuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        parentEditPasswordFailure(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const profileSectionFetchLogic = createLogic({
  type: profileSectionFetch.type,
  latest: true,

  async process({ getState, action, authAxios }, dispatch, done) {
    crashlytics().log(`Updating profile section (Logic)`);
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });
      if (!parentId) throw new Error("Login to visit the profile ");
      const specifiSection = action.payload.section;

      dispatch(profileSectionChange(specifiSection));
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

export default [
  parentProfilePicFetchLogic,
  parentEditFetchLogic,
  parentEditPasswordFetchLogic,
  childEditFetchLogic,
  profileSectionFetchLogic,
  childProfilePicFetchLogic,
];

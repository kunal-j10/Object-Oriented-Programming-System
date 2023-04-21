import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  vaccineFetch,
  vaccineFetchSuccess,
  vaccineFetchFail,
  vaccineStore,
  vaccineStoreSuccess,
  vaccineStoreFail,
} from "./slice";
import { addNoInternetAction } from "../auth/slice";

import uploadFile from "../../src/utils/uploadFile";

const vaccineFetchLogic = createLogic({
  type: vaccineFetch.type,
  latest: true,

  async process({ getState, action, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching vaccines in vaccination screen (endpoint: /vaccination) (Logic)"
    );

    const { category, limit, isHomeScreen } = action.payload;
    try {
      const {
        auth: { parentId, selectedChildId, childrenDetails },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      let childrendata;

      if (!isHomeScreen && childrenDetails?.length === 0) {
        if (category !== "All") {
          throw new Error(
            `First Add atleast one child to view the ${category} section`
          );
        }
      } else {
        childrendata = childrenDetails.find(
          (child) => child._id === selectedChildId
        );
      }

      const res = await momAxios.get("/vaccination", {
        params: {
          childId: childrendata?._id,
          dob: childrendata?.dob,
          type: category.toLowerCase(),
          limit,
        },
      });

      let data;

      if (category === "Completed") {
        data = res.data.data.map((item) => {
          const attachmentDetails = item.attachmentDetails.map(
            (attachment) => ({
              fileName: attachment.fileName,
              fileType: attachment.fileType,
              uri: attachment.mediaUrl,
              sizeInBytes: attachment.sizeInBytes,
            })
          );

          return {
            ...item,
            attachmentDetails,
          };
        });
      } else {
        data = res.data.data;
      }

      dispatch(vaccineFetchSuccess({ data, isHomeScreen }));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(
          addNoInternetAction({
            type: vaccineFetch.type,
            payload: action.payload,
          })
        );
      }

      dispatch(
        vaccineFetchFail({
          error: get(err, "response.data.error.message", err.message),
          isHomeScreen,
        })
      );
    }
    done();
  },
});

const vaccineStoreLogic = createLogic({
  type: vaccineStore.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Storing vaccine taken date and Uploading vaccination tag in vaccination screen (endpoint: /uploadPublicFile and /vaccination/store) (Logic)"
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
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const childrendata = childrenDetails.find(
        (child) => child._id === selectedChildId
      );

      const { category, vaccineId, takenOnDate, imagesUri } = action.payload;

      let attachmentDetails = [];

      for (let index = 0; index < imagesUri.length; index++) {
        const { fileName, fileType, uri, sizeInBytes } = imagesUri[index];
        if (uri.startsWith("https://firebasestorage.googleapis.com/")) {
          attachmentDetails.push({
            fileName,
            fileType,
            sizeInBytes,
            mediaUrl: uri,
          });
        } else {
          const refString = `vaccines/parentId_${parentId}/childId_${selectedChildId}/vaccineId_${vaccineId}/${uri
            .split("/")
            .pop()}`;

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

          attachmentDetails.push(attachmentDetail);
        }
      }

      await momAxios.post("/vaccination/store", {
        childId: selectedChildId,
        dob: childrendata.dob,
        vaccineId,
        takenOnDate,
        attachmentDetails,
      });

      dispatch(vaccineStoreSuccess());
      dispatch(vaccineFetch({ category, status: "loading" }));
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(
        vaccineStoreFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

export default [vaccineFetchLogic, vaccineStoreLogic];

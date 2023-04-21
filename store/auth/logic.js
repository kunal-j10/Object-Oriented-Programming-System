import { createLogic } from "redux-logic";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";
import { getUniqueId } from "react-native-device-info";

import {
  login,
  loginFail,
  loginSuccess,
  sendOtp,
  sendOtpFail,
  sendOtpSuccess,
  loginOtp,
  loginOtpSuccess,
  loginOtpFail,
  verifyResetOtp,
  verifyResetOtpSuccess,
  verifyResetOtpFail,
  changePass,
  changePassSuccess,
  changePassFail,
  signUp,
  signUpSuccess,
  signUpFail,
  sendOtpReg,
  sendOtpRegSuccess,
  sendOtpRegFail,
  verifySignUpOtp,
  verifySignUpOtpSuccess,
  verifySignUpOtpFail,
  addChild,
  addChildSuccess,
  addChildFail,
  logout,
  parentDetailsFetch,
  parentDetailsFetchFail,
  parentDetailsFetchSuccess,
  refreshToken,
  refreshTokenFail,
  refreshTokenSuccess,
  switchChildSuccess,
  switchChildFailure,
  switchChild,
  executeActionsOnInternet,
  noInternetRefresh,
  executeActionsOnInternetSuccess,
  sendFCMToken,
  authSignInGoogle,
  authSignInGoogleSuccess,
  authSignInGoogleFail,
} from "./slice";
import { sendToken } from "../../src/utils/cloudMessaging";
import { authBlacklistInitialLoading } from "../authBlacklist/slice";

const loginLogic = createLogic({
  type: login.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log("Login (endpoint: /parent/login) (Logic)");
    try {
      const { username, password } = action.payload;

      const res = await authAxios.post("/parent/login", { username, password });

      dispatch(loginSuccess(res.data));
      await sendToken(dispatch);
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(loginFail(get(err, "response.data.error.message", err.message)));
    }
    done();
  },
});

const sendOtpLogic = createLogic({
  type: sendOtp.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log(
      "To generate the otp (endpoint: /parent/sendOTP) (Logic)"
    );
    try {
      const phoneNumber = action.payload;

      const res = await authAxios.post("/parent/sendOTP", { phoneNumber });
      dispatch(sendOtpSuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        sendOtpFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const loginOtpLogic = createLogic({
  type: loginOtp.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Verifying the otp for login (endpoint: /parent/verifyotp) (Logic)"
    );
    try {
      const { phone: phoneNumber, otp } = action.payload;

      const res = await authAxios.post("/parent/verifyotp", {
        phoneNumber,
        otp,
        type: "logging",
      });

      dispatch(loginOtpSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        loginOtpFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const verifyResetOtpLogic = createLogic({
  type: verifyResetOtp.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Verifying the otp for reseting the password (endpoint: /parent/verifyAndResetToken) (Logic)"
    );
    try {
      const { phone: phoneNumber, otp } = action.payload;

      const res = await authAxios.post("/parent/verifyAndResetToken", {
        phoneNumber,
        otp,
      });

      dispatch(verifyResetOtpSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        verifyResetOtpFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const changePassLogic = createLogic({
  type: changePass.type,
  latest: true,

  async process({ getState, action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Changing the password after otp verification (endpoint: /parent/changePass) (Logic)"
    );
    try {
      const {
        auth: { resetPassToken: token, parentId },
      } = getState();

      const password = action.payload;

      const res = await authAxios.post("/parent/changePass", {
        parentId,
        token,
        password,
      });

      dispatch(changePassSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        changePassFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const signUpLogic = createLogic({
  type: signUp.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Sending name, gender, phoneNumber, etc. for signUp (endpoint: /parent/signup) (Logic)"
    );
    try {
      const { name, gender, phoneNumber, email, password } = action.payload;

      const res = await authAxios.post("/parent/signup", {
        name,
        gender,
        phoneNumber,
        email,
        password,
      });

      dispatch(signUpSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        signUpFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const sendOtpRegLogic = createLogic({
  type: sendOtpReg.type,
  latest: true,

  async process({ getState, action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Generating the otp for signUp (endpoint: /parent/sendOTPWhileReg) (Logic)"
    );
    try {
      const {
        auth: { parentId },
      } = getState();

      const phoneNumber = action.payload;

      await authAxios.post("/parent/sendOTPWhileReg", {
        parentId,
        phoneNumber,
      });

      dispatch(sendOtpRegSuccess());
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        sendOtpRegFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const verifySignUpOtpLogic = createLogic({
  type: verifySignUpOtp.type,
  latest: true,

  async process({ action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Verifying the otp for signUp (endpoint: /parent/verifyotp) (Logic)"
    );
    try {
      const { phone: phoneNumber, otp } = action.payload;

      const res = await authAxios.post("/parent/verifyotp", {
        phoneNumber,
        otp,
        type: "registration",
      });

      dispatch(verifySignUpOtpSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        verifySignUpOtpFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const addChildLogic = createLogic({
  type: addChild.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log("To add the child (endpoint: /parent/addchild) (Logic)");
    try {
      const {
        auth: { parentId },
      } = getState();

      let { payload } = action;

      const res = await momAxios.post("/parent/addchild", {
        ...payload,
        parentId,
      });

      dispatch(addChildSuccess(res.data));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        addChildFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const refreshLogic = createLogic({
  type: refreshToken.type,
  latest: true,

  async process({ action, authAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Refreshing the token if the isAuthenticated value becomes false (endpoint: /parent/refresh-token) (Logic)"
    );
    try {
      const { refreshToken, parentId } = action.payload;

      const res = await authAxios.post(
        "/parent/refresh-token",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          refreshing: true,
        }
      );

      dispatch(
        refreshTokenSuccess({
          ...res.data,
          refreshToken,
          parentId,
        })
      );
    } catch (err) {
      crashlytics().recordError(err);

      dispatch(logout(err.message));

      dispatch(
        refreshTokenFail(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const parentDetailsFetchLogic = createLogic({
  type: parentDetailsFetch.type,
  latest: true,

  async process({action, getState, momAxios, networkError }, dispatch, done) {
    crashlytics().log(
      "Fetching parent details (endpoint: /parent/details) (Logic)"
    );
    try {
      const {
        auth: { parentId },
      } = getState();
const {status} = action.payload
      const res = await momAxios.get("/parent/details", {
        params: { parentId },
      });

      dispatch(parentDetailsFetchSuccess({data:res.data,status}));
    } catch (err) {
      crashlytics().recordError(err);

      if (err.message === networkError) {
        dispatch(authBlacklistInitialLoading(false));
        // dispatch(noInternetRefresh());
      }

      dispatch(
        parentDetailsFetchFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

const switchChildLogic = createLogic({
  type: switchChild.type,
  latest: true,

  async process({ action }, dispatch, done) {
    crashlytics().log("To switch the child (Logic)");
    try {
      const childId = action.payload;

      dispatch(switchChildSuccess(childId));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        switchChildFailure(get(err, "response.data.error.message", err.message))
      );
    }
    done();
  },
});

const executeActionsOnInternetLogic = createLogic({
  type: executeActionsOnInternet.type,
  latest: true,

  process({ getState }, dispatch, done) {
    const {
      auth: { actionTypes },
    } = getState();

    for (let index = actionTypes.length - 1; index >= 0; index--) {
      const action = actionTypes[index];
      dispatch(action);
    }
    dispatch(executeActionsOnInternetSuccess());
    done();
  },
});

const sendFCMTokenLogic = createLogic({
  type: sendFCMToken.type,
  latest: true,

  async process({ getState, action, momAxios }, dispatch, done) {
    crashlytics().log(
      "Sending the FCM token (endpoint: /parent/addFCMToken) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const token = action.payload;

      const res = await momAxios.post("/parent/addFCMToken", {
        deviceId: getUniqueId(),
        token,
      });
    } catch (err) {
      crashlytics().recordError(err);
    }
    done();
  },
});

const authSignInGoogleLogic = createLogic({
  type: authSignInGoogle.type,
  latest: true,

  async process({ getState, action, authAxios }, dispatch, done) {
    crashlytics().log(
      "Sign In with google (endpoint: /parent/loginWithGoogle) (Logic)"
    );
    try {
      const {
        auth: { parentId, selectedChildId },
      } = getState();
      crashlytics().setAttributes({
        parentId,
        childId: selectedChildId,
      });

      const { token, user } = action.payload;

      const res = await authAxios.post(
        "/parent/loginWithGoogle",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          refreshing: true,
        }
      );

      dispatch(authSignInGoogleSuccess({ data: res.data, user }));
    } catch (err) {
      crashlytics().recordError(err);
      dispatch(
        authSignInGoogleFail(
          get(err, "response.data.error.message", err.message)
        )
      );
    }
    done();
  },
});

export default [
  loginLogic,
  sendOtpLogic,
  loginOtpLogic,
  verifyResetOtpLogic,
  changePassLogic,
  signUpLogic,
  sendOtpRegLogic,
  verifySignUpOtpLogic,
  addChildLogic,
  refreshLogic,
  parentDetailsFetchLogic,
  switchChildLogic,
  executeActionsOnInternetLogic,
  sendFCMTokenLogic,
  authSignInGoogleLogic,
];

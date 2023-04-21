import { createSlice } from "@reduxjs/toolkit";
import { parentChildAdded } from "./selector";
import DefaultConfig from "../../constants/config.json";

const initialState = {
  isAuthenticated: false,
  authLoading: false,
  refreshFailed: false,
  accessToken: "",
  firebaseToken: "",
  refreshToken: "",
  ttl: "",
  parentId: "",
  name: "",
  phoneNumber: "",
  email: "",
  color: "",
  nameinitials: "",
  childrenDetails: [],
  parentDetails: {},
  activechildDetails: {},
  activechildDetailsLoading: null,
  selectedChildId: null,
  error: "",
  isFirstTime: null,
  otpGenerated: "waiting",
  resetPassToken: null,
  successMessage: "",
  actionTypes: [],
  parentChildAdded: null,
  isSignUpThroughGoogle: false,
  signUpGoogleName: "",
  signUpGoogleEmail: "",
  parentDetailsIsrefreshing: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    firstTimeUser(state, { payload }) {
      state.isFirstTime = payload;
    },
    login(state) {
      state.authLoading = true;
    },
    loginSuccess(state, { payload }) {
      state.authLoading = false;
      state.isAuthenticated = true;
      state.accessToken = payload.accessToken;
      state.firebaseToken = payload.firebaseToken;
      state.refreshToken = payload.refreshToken;
      state.ttl = payload.ttl;
      state.parentId = payload.parentId;
      state.name = payload.name;
      state.color = payload.color;
      state.nameinitials = payload.nameinitials;
      state.phoneNumber = payload.phoneNumber;
      state.email = payload.email;
    },
    loginFail(state, { payload }) {
      state.authLoading = false;
      state.isAuthenticated = false;
      state.error = payload;
    },
    sendOtp(state) {
      state.otpGenerated = "loading";
    },
    sendOtpSuccess(state) {
      state.otpGenerated = "generated";
    },
    sendOtpFail(state, { payload }) {
      state.otpGenerated = "failed";
      state.error = payload;
    },
    loginOtp(state) {
      state.otpGenerated = "waiting";
      state.authLoading = true;
    },
    loginOtpSuccess(state, { payload }) {
      state.authLoading = false;
      state.isAuthenticated = true;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.ttl = payload.ttl;
      state.parentId = payload.parentId;
    },
    loginOtpFail(state, { payload }) {
      state.authLoading = false;
      state.isAuthenticated = false;
      state.error = payload;
    },
    verifyResetOtp(state) {
      state.otpGenerated = "waiting";
      state.resetPassToken = null;
      state.authLoading = true;
    },
    verifyResetOtpSuccess(state, { payload }) {
      state.authLoading = false;
      state.resetPassToken = payload.token;
      state.parentId = payload.parentId;
    },
    verifyResetOtpFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    changePass(state) {
      state.authLoading = true;
    },
    changePassSuccess(state, { payload }) {
      state.authLoading = false;
      state.successMessage = payload.Message;
    },
    changePassFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    signUp(state) {
      state.authLoading = true;
    },
    signUpSuccess(state, { payload }) {
      state.authLoading = false;
      state.parentId = payload._id;
      state.phoneNumber = payload.phoneNumber;
    },
    signUpFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    sendOtpReg(state) {
      state.otpGenerated = "loading";
    },
    sendOtpRegSuccess(state) {
      state.otpGenerated = "generated";
    },
    sendOtpRegFail(state, { payload }) {
      state.otpGenerated = "failed";
      state.error = payload;
    },
    verifySignUpOtp(state) {
      state.otpGenerated = "waiting";
      state.authLoading = true;
    },
    verifySignUpOtpSuccess(state, { payload }) {
      state.authLoading = false;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.ttl = payload.ttl;
      state.parentId = payload.parentId;
    },
    verifySignUpOtpFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    skipChild(state) {
      state.isAuthenticated = true;
    },
    addChild(state) {
      state.authLoading = true;
    },
    addChildSuccess(state) {
      state.authLoading = false;
      state.isAuthenticated = true;
    },
    addChildFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    logout(state, { payload }) {
      if (payload !== DefaultConfig.network_error_message) {
        state.isAuthenticated = false;
        state.authLoading = false;
        state.refreshFailed = false;
        state.accessToken = "";
        state.firebaseToken = "";
        state.refreshToken = "";
        state.ttl = "";
        state.parentId = "";
        state.name = "";
        state.phoneNumber = "";
        state.email = "";
        state.color = "";
        state.nameinitials = "";
        state.childrenDetails = [];
        state.parentDetails = {};
        state.activechildDetails = {};
        state.activechildDetailsLoading = null;
        state.selectedChildId = null;
        state.error = "";
        state.isFirstTime = false;
        state.otpGenerated = "waiting";
        state.resetPassToken = null;
        state.successMessage = "";
        state.actionTypes = [];
        state.parentChildAdded = null;
      } else {
        state.error = payload;
      }
    },
    refreshToken(state, { payload }) {
      if (payload.afterNetworkError) state.refreshFailed = false;
    },
    refreshTokenSuccess(state, { payload }) {
      state.isAuthenticated = true;
      state.refreshToken = payload.refreshToken;
      state.accessToken = payload.accessToken;
      state.firebaseToken = payload.firebaseToken;
      state.ttl = payload.ttl;
      state.parentId = payload.parentId;
    },
    refreshTokenFail(state, { payload }) {
      state.isAuthenticated = false;
      state.error = payload;
    },
    refreshTokenAxios(state, { payload }) {
      state.accessToken = payload.accessToken;
      state.firebaseToken = payload.firebaseToken;
      state.ttl = payload.ttl;
    },
    parentDetailsFetch(state,{payload}) {
      state.activechildDetailsLoading = true;
      if(payload.status == "refreshing"){
        state.parentDetailsIsrefreshing = true
      }else if(payload.status == "loading"){
        state.authLoading = true;
      }
     
    },
    parentDetailsFetchSuccess(state, { payload }) {
      const { parent_details, children_details } = payload.data;
      state.name = parent_details.name;
      state.phoneNumber = parent_details.phoneNumber;
      state.email = parent_details.email;
      state.color = parent_details.color;
      state.nameinitials = parent_details.nameinitials;
      state.parentDetails = parent_details;
      state.childrenDetails = children_details;
      state.selectedChildId = children_details[0]?._id;
      if (state.parentDetails.children.length == 0) {
        state.parentChildAdded = false;
      } else {
        state.parentChildAdded = true;
      }
      state.activechildDetails = children_details.length > 0 ? children_details[0] : null;
      state.activechildDetailsLoading = false;
      state.authLoading = false;
      state.parentDetailsIsrefreshing = false
    },
    parentDetailsFetchFail(state, { payload }) {
      state.authLoading = false;
      state.activechildDetailsLoading = true;
      state.error = payload;
      state.parentDetailsIsrefreshing = false
    },
    removeAuthError(state) {
      state.error = "";
    },
    switchChild() {},
    switchChildSuccess(state, { payload }) {
      state.selectedChildId = payload;
      state.activechildDetails = state.childrenDetails.find(
        (item) => item._id == payload
      );
      state.activechildDetailsLoading = false;
    },
    switchChildFailure(state, { payload }) {
      state.error = payload;
    },
    noInternetRefresh(state) {
      state.refreshFailed = true;
      state.actionTypes = [];
    },
    addNoInternetAction(state, { payload }) {
      const actions = state.actionTypes.filter(
        (action) => action.type !== payload.type
      );
      actions.push(payload);
      state.actionTypes = actions;
    },
    removeNoInternetAction(state, { payload: type }) {
      state.actionTypes = state.actionTypes.filter(
        (action) => action.type !== type
      );
    },
    executeActionsOnInternet() {},
    executeActionsOnInternetSuccess(state) {
      state.actionTypes = [];
    },
    sendFCMToken(state, { payload }) {},
    authSignInGoogle(state, { payload }) {
      state.authLoading = true;
    },
    authSignInGoogleSuccess(state, { payload }) {
      if (payload.data.isRegistered) {
        state.parentId = payload.data.parentId;
        state.name = payload.data.name;
        state.phoneNumber = payload.data.phoneNumber;
        state.email = payload.data.email;
        state.accessToken = payload.data.accessToken;
        state.firebaseToken = payload.data.firebaseToken;
        state.refreshToken = payload.data.refreshToken;
        state.ttl = payload.data.ttl;
        state.isAuthenticated = true;
      } else {
        state.isSignUpThroughGoogle = true;
        state.signUpGoogleEmail = payload.user.email;
        state.signUpGoogleName = payload.user.name;
      }
      state.authLoading = false;
    },
    authSignInGoogleFail(state, { payload }) {
      state.authLoading = false;
      state.error = payload;
    },
    authRemoveSignUpGoogleField(state, { payload }) {
      state.isSignUpThroughGoogle = false;
      state.signUpGoogleEmail = "";
      state.signUpGoogleName = "";
    },
  },
});

export const {
  firstTimeUser,
  login,
  loginSuccess,
  loginFail,
  sendOtp,
  sendOtpSuccess,
  sendOtpFail,
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
  skipChild,
  addChild,
  addChildSuccess,
  addChildFail,
  logout,
  logoutFail,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFail,
  refreshTokenAxios,
  parentDetailsFetch,
  parentDetailsFetchSuccess,
  parentDetailsFetchFail,
  removeAuthError,
  switchChildSuccess,
  switchChildFailure,
  switchChild,
  noInternetRefresh,
  addNoInternetAction,
  removeNoInternetAction,
  executeActionsOnInternet,
  executeActionsOnInternetSuccess,
  stopInitialLoading,
  sendFCMToken,
  authSignInGoogle,
  authSignInGoogleSuccess,
  authSignInGoogleFail,
  authRemoveSignUpGoogleField,
} = authSlice.actions;

export default authSlice.reducer;

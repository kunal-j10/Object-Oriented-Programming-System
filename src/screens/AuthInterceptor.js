import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import get from "lodash/get";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  accessTokenSelector,
  refreshTokenSelector,
  ttlSelector,
} from "../../store/auth/selector";
import {
  logout,
  refreshTokenAxios,
  noInternetRefresh,
} from "../../store/auth/operation";
import {
  momAxios,
  communityAxios,
  mediaAxios,
  authAxios,
} from "../services/axios";
import { generateAxiosError } from "../utils/auth";
import DefaultConfig from "../../constants/config.json";
import { authBlacklistInitialLoading } from "../../store/authBlacklist/slice";
import { authBlacklistIsInternetReachableSelector } from "../../store/authBlacklist/selector";

export default function AuthInterceptor() {
  // const [momInterceptor, setMomInterceptor] = useState(null);
  // const [communityInterceptor, setCommunityInterceptor] = useState(null);
  // const [mediaInterceptor, setMediaInterceptor] = useState(null);

  const accessToken = useSelector(accessTokenSelector);
  const refreshingToken = useSelector(refreshTokenSelector);
  const ttl = useSelector(ttlSelector);
  const isInternetReachable = useSelector(
    authBlacklistIsInternetReachableSelector
  );

  const dispatch = useDispatch();

  const tokenInjectorInterceptor = async (config) => {
    if (!isInternetReachable) {
      return generateAxiosError(DefaultConfig.network_error_message, config);
    }

    if (config.headers.hasOwnProperty("Authorization")) {
      return config;
    }

    let newAccessToken, newTTL;

    if (accessToken && ttl && ttl <= new Date().getTime()) {
      crashlytics().log("Refreshing the token in the auth interceptor");
      try {
        const res = await authAxios.post(
          "/parent/refresh-token",
          {},
          {
            headers: { Authorization: `Bearer ${refreshingToken}` },
            refreshing: true,
          }
        );

        dispatch(refreshTokenAxios(res.data));
        newAccessToken = res.data.accessToken;
        newTTL = res.data.ttl;
      } catch (err) {
        crashlytics().recordError(err);

        dispatch(logout(err.message));
        return generateAxiosError(
          get(err, "response.data.error.message", err.message),
          config
        );
      }
    }

    if (newAccessToken && newTTL) {
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else if (accessToken && ttl) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  };

  const authInterceptor = async (err) => {
    if (
      err.config.refreshing &&
      err.message === DefaultConfig.network_error_message
    ) {
      dispatch(authBlacklistInitialLoading(false));
      // dispatch(noInternetRefresh());
    }

    return Promise.reject(err);
  };

  useEffect(() => {
    const authInterceptorId = authAxios.interceptors.response.use(
      (res) => res,
      authInterceptor
    );

    const momInterceptorId = momAxios.interceptors.request.use(
      tokenInjectorInterceptor
    );

    const communityInterceptorId = communityAxios.interceptors.request.use(
      tokenInjectorInterceptor
    );

    const mediaInterceptorId = mediaAxios.interceptors.request.use(
      tokenInjectorInterceptor
    );

    // setMomInterceptor(momInterceptorId);
    // setCommunityInterceptor(communityInterceptorId);
    // setMediaInterceptor(mediaInterceptorId);

    return () => {
      authAxios.interceptors.response.eject(authInterceptorId);

      momAxios.interceptors.request.eject(momInterceptorId);
      communityAxios.interceptors.request.eject(communityInterceptorId);
      mediaAxios.interceptors.request.eject(mediaInterceptorId);
      // setMomInterceptor(null);
      // setCommunityInterceptor(null);
      // setMediaInterceptor(null);
    };
  }, [refreshingToken, accessToken, ttl]);

  return <></>;
}

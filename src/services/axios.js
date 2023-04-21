import axios from "axios";
import * as rax from "retry-axios";

import Config from "../../constants/config.json";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = Config.axios_default_timeout;

const defaultConfig = {
  httpMethodsToRetry: ["GET"],
  statusCodesToRetry: [
    [100, 199],
    [408, 429],
    [500, 599],
  ],
  // onRetryAttempt: (err) => {
  //   const cfg = rax.getConfig(err);
  //   console.log(`Retry attempt ${err.config.url} #${cfg.currentRetryAttempt}`);
  // },
  shouldRetry: (err) => {
    if (err.message === "Network Error") {
      err.message = Config.network_error_message;
      return false;
    }

    return rax.shouldRetryRequest(err);
  },
};

export const authAxios = axios.create({
  baseURL: Config.auth_baseurl,
});
authAxios.defaults.raxConfig = {
  instance: authAxios,
  ...defaultConfig,
};
rax.attach(authAxios);

export const momAxios = axios.create({
  baseURL: Config.mom_service_baseurl,
});
momAxios.defaults.raxConfig = {
  instance: momAxios,
  ...defaultConfig,
};
rax.attach(momAxios);

export const communityAxios = axios.create({
  baseURL: Config.community_service_baseurl,
});
communityAxios.defaults.raxConfig = {
  instance: communityAxios,
  ...defaultConfig,
};
rax.attach(communityAxios);

export const mediaAxios = axios.create({
  baseURL: Config.media_service_baseurl,
});
mediaAxios.defaults.raxConfig = {
  instance: mediaAxios,
  ...defaultConfig,
};
rax.attach(mediaAxios);

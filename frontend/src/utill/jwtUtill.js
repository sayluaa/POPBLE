import axios from "axios";
import { getCookie, setCookie } from "./cookieUtill";
import { API_SERVER_HOST } from "../api/config";
import store from "../store";
import { refreshTokenSuccess, logout } from "../slice/authSlice";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;

  const header = { headers: { Authorization: `Bearer ${accessToken}` } };

  const res = await axios.get(
    `${host}/api/user/refresh?refreshToken=${refreshToken}`,
    header
  );

  console.log("-------------------------------------");
  console.log(res.data);

  return res.data;
};

const beforeReq = (config) => {
  console.log("before request.....................");

  const userInfo = getCookie("user");

  if (!userInfo) {
    console.log("user NOT FOUND");
    return Promise.reject({
      response: {
        data: {
          error: "REQUIRE_LOGIN",
        },
      },
    });
  }

  const { accessToken } = userInfo;

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

const requestFail = (err) => {
  console.log("request error........................");

  return Promise.reject(err);
};

const beforeRes = async (res) => {
  console.log("before return responce.......................");

  const data = res.data;

  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const userCookieValue = getCookie("user");
    if (!userCookieValue) {
      store.dispatch(logout());
      return Promise.reject({ response: { data: { error: "REQUIRE_LOGIN" } } });
    }

    const result = await refreshJWT(
      userCookieValue.accessToken,
      userCookieValue.refreshToken
    );

    console.log("refreshJWT RESULT", result);

    // userCookieValue.accessToken = result.accessToken;
    // userCookieValue.refreshToken = result.refreshToken;

    // setCookie("user", JSON.stringify(userCookieValue), 1);

    store.dispatch(refreshTokenSuccess(result));

    const originalRequest = res.config;

    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    return await axios(originalRequest);
  }

  return res;
};

const responseFail = (err) => {
  console.log("response fail error.....................");

  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);

jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

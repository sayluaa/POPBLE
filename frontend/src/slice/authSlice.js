import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, removeCookie } from "../utill/cookieUtill";

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  userProfile: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { accessToken, refreshToken, user, userProfile } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.userProfile = userProfile;
      state.isAuthenticated = true;

      //쿠키에도 동기화
      setCookie(
        "user",
        // 1일동안
        JSON.stringify({ accessToken, refreshToken, user, userProfile }, 1)
      );
    },

    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.userProfile = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      //쿠키 삭제
      removeCookie("user");
    },

    //유저프로필 수정
    updateUserProfileRedux(state, action) {
      //action.payload 업데이트된 userProfile 정보가 있음
      state.user = {
        ...state.user, //기존 user정보
        ...action.payload, //업데이트된 프로필 정보 추가(nickname, profileImg)
      };

      //현재 토큰, 갱신된 user가져옴
      const { accessToken, refreshToken, user } = state;

      //변경된 상태를 쿠키에 저장
      setCookie(
        "user",
        JSON.stringify(
          { accessToken, refreshToken, user, userProfile: null },
          1
        )
      );
    },
    //리프레시 토큰
    refreshTokenSuccess(state, action) {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      const user = state.user;
      const userProfile = state.userProfile;
      setCookie(
        "user",
        JSON.stringify({ accessToken, refreshToken, user, userProfile }),
        1
      );
    },
  },
});

export const {
  loginSuccess,
  logout,
  refreshTokenSuccess,
  updateUserProfileRedux,
} = authSlice.actions;
export default authSlice.reducer;

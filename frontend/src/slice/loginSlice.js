import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/userApi";
import { setCookie, getCookie, removeCookie } from "../utill/cookieUtill";

const initState = {
  id: "",
  loginId: "",
};

const loadUserCookie = () => {
  const userInfo = getCookie("user");

  if (userInfo && userInfo.name) {
    userInfo.name = decodeURIComponent(userInfo.name);
  }
  return userInfo;
};

export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadUserCookie() || initState,

  reducers: {
    login: (state, action) => {
      console.log("login.........");

      const data = action.payload;

      return { loginId: data.loginId, id: data.id };
    },

    logout: (state, action) => {
      removeCookie("user");
      return { ...initState };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log("fulfilled");

        const payload = action.payload;
        if (!payload.error) {
          setCookie("user", JSON.stringify(payload), 1);
        }

        return payload;
      })

      .addCase(loginPostAsync.pending, (state, action) => {
        console.log("pending");
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;

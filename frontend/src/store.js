import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slice/loginSlice"
import authReducer from "./slice/authSlice"
export default configureStore({
    reducer:{
        loginSlice : loginSlice,
         auth: authReducer,
    },

  

})



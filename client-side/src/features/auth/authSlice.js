import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin, userVerify } from "./authActions";
import { toast } from "react-toastify";

// initialize userToken from local storage
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

const initialState = {
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
  authentication: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken"); // delete token from storage
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload
    },
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload.admin;
      state.userToken = payload.createdToken;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      const { error, message, token } = payload || {};
      if (error) {
        state.success = false;
        toast.error(error+'from sdssd');
      } else {
        state.success = true; // registration successful
        state.userToken = token;
        toast.success(message);
      }
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // verify user email
    [userVerify.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userVerify.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true; // user verification successful
    },
    [userVerify.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { logout , setCredentials} = authSlice.actions;

export default authSlice.reducer;

import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const backendURL =
  process.env.NODE_ENV !== "production"
    ? import.meta.env.VITE_DEVELOPMENT_SERVER_URL
    : import.meta.env.VITE_PRODUCTION_SERVER_URL;

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password, loginCode }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/admin/login`,
        { email, password, loginCode },
        config
      );
      
      // store user's token in local storage
      localStorage.setItem("userToken", data.createdToken);

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/user-register`,
        { username, email, password },
        config
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userVerify = createAsyncThunk(
  "auth/email/verify",
  async ({ token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          // 'Content-Type': 'application/json',
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      await axios.post(`${backendURL}/user-verify`, { token }, config);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const backendURL =
  process.env.NODE_ENV !== "production"
    ? import.meta.env.VITE_DEVELOPMENT_SERVER_URL
    : import.meta.env.VITE_PRODUCTION_SERVER_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:backendURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userToken;
      if (token) {
        headers.set("authorization", `${token}`);
        return headers;
      }
    },
  }),
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: () => ({
        url: "/user-info",
        method: "GET",
      }),
    }),
  }),
});

// export react hook
export const { useGetUserInfoQuery } = authApi;

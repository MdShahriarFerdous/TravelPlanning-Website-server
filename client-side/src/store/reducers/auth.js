
import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authentication : undefined
  },
  reducers: {
    setAuthentication: (state, payload) => {
      state.authentication = payload;
    }
  }
});

export const {setAuthentication} = authSlice.actions;

export default authSlice.reducer;

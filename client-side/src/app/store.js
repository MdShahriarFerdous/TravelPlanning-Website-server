import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import uiReducer from '@features/ui/uiSlice'
import { authApi } from './services/auth/authService'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})

export default store

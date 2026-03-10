import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState } from './types.ts'

const initialState: AuthState = {
  idToken: null,
  userId: null,
  email: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ idToken: string; userId: string; email: string }>) {
      state.idToken = action.payload.idToken
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.isAuthenticated = true
    },
    clearToken(state) {
      state.idToken = null
      state.userId = null
      state.email = null
      state.isAuthenticated = false
    },
  },
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer

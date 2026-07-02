import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import authApi, { type AuthUser } from "@/lib/api/auth"

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authApi.login(email, password)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.checkAuth()
    } catch {
      // Access token cookie (55 min) may have simply expired while the refresh
      // token cookie (30 days) is still valid — try a silent refresh once before
      // treating this as a real logout.
      try {
        await authApi.refreshToken()
        return await authApi.checkAuth()
      } catch {
        return rejectWithValue(null)
      }
    }
  },
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: {
      firstName: string
      lastName: string
      email: string
      password: string
      phoneNumber?: string
    },
    { rejectWithValue },
  ) => {
    try {
      return await authApi.register({ ...payload, agreeTerms: true })
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

interface AuthState {
  user: AuthUser | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  sessionChecked: boolean
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  sessionChecked: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null
      state.status = "idle"
      state.error = null
      state.sessionChecked = true
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) Object.assign(state.user, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.status = "succeeded"
        state.user = action.payload
        state.sessionChecked = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
        state.sessionChecked = true
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading"
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.status = "succeeded"
        state.user = action.payload
        state.sessionChecked = true
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null
        state.status = "idle"
        state.sessionChecked = true
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "idle"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export const { clearAuth, updateUser } = authSlice.actions
export default authSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import publicApi from "../../api/publicApi";

/* ================= LOGIN ================= */

export const loginUser = createAsyncThunk(
  "login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await publicApi.post("/v1/user/login", credentials);
      return res.data; // { token, user, tokenExpiresAt }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ================= REGISTER ================= */

export const registerUser = createAsyncThunk(
  "register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/v1/user/register", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token"),
  tokenExpiresAt: Number(localStorage.getItem("tokenExpiresAt")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiresAt");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user, tokenExpiresAt } = action.payload || {};

        state.loading = false;
        state.token = token || null;
        state.user = user || null;
        state.tokenExpiresAt = tokenExpiresAt || null;
        state.isAuthenticated = !!token;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("tokenExpiresAt", tokenExpiresAt || "");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

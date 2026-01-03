// src/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./axiosInstance";

// ===============================
// LOGIN USER
// ===============================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // ✅ relative path for Vite proxy
      const res = await api.post("/v1/user/login", credentials);
      return res.data; // { token, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ===============================
// REGISTER USER
// ===============================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      // ✅ relative path for Vite proxy
      const res = await api.post("/v1/user/register", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || {},
  token: localStorage.getItem("token") || null,
  tokenExpiresAt: Number(localStorage.getItem("tokenExpiresAt")) || null,
  loading: false,
  error: null,
};

// ===============================
// SLICE
// ===============================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {};
      state.token = null;
      state.tokenExpiresAt = null;
      state.error = null;
      localStorage.clear();
      window.location.href = "/login";
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
        state.loading = false;

        const token = action.payload?.token || null;
        const user = action.payload?.user || {};

        state.token = token;
        state.user = user;
        state.tokenExpiresAt = user?.tokenExpiresAt || null;

        localStorage.setItem("token", token || "");
        localStorage.setItem("tokenExpiresAt", user?.tokenExpiresAt || "");
        localStorage.setItem("user", JSON.stringify(user));
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
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

// ===============================
// EXPORTS
// ===============================
export const { logout } = authSlice.actions;
export default authSlice.reducer;

// ===============================
// AUTO-LOGOUT CHECKER (Every 5 sec)
// ===============================
setInterval(() => {
  const expiry = Number(localStorage.getItem("tokenExpiresAt"));
  const token = localStorage.getItem("token");

  if (token && expiry && Date.now() > expiry) {
    localStorage.clear();
    window.location.href = "/login";
  }
}, 5000);

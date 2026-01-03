import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./axiosInstance";

<<<<<<< HEAD
// ===============================
// LOGIN USER
// ===============================
=======
/* =========================
   LOGIN USER
========================= */
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      // ✅ relative path for Vite proxy
      const res = await api.post("/v1/user/login", credentials);
      return res.data; // { token, user }
=======
      const res = await api.post("/user/login", credentials);
      return res.data; // { token, user, tokenExpiresAt }
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =========================
   REGISTER USER
========================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      // ✅ relative path for Vite proxy
      const res = await api.post("/v1/user/register", formData);
=======
      const res = await api.post("/user/register", formData);
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

<<<<<<< HEAD
// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || {},
  token: localStorage.getItem("token") || null,
=======
/* =========================
   INITIAL STATE
========================= */
const initialState = {
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("token"),
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
  tokenExpiresAt: Number(localStorage.getItem("tokenExpiresAt")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

<<<<<<< HEAD
// ===============================
// SLICE
// ===============================
=======
/* =========================
   AUTH SLICE
========================= */
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {};
      state.token = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiresAt");
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- LOGIN ---- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

<<<<<<< HEAD
        const token = action.payload?.token || null;
        const user = action.payload?.user || {};

        state.token = token;
        state.user = user;
        state.tokenExpiresAt = user?.tokenExpiresAt || null;

        localStorage.setItem("token", token || "");
        localStorage.setItem("tokenExpiresAt", user?.tokenExpiresAt || "");
=======
        const { token, user, tokenExpiresAt } = action.payload;

        state.token = token;
        state.user = user;
        state.tokenExpiresAt = tokenExpiresAt;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiresAt", tokenExpiresAt);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
<<<<<<< HEAD
      // REGISTER
=======

      /* ---- REGISTER ---- */
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
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

// ===============================
// EXPORTS
// ===============================
export const { logout } = authSlice.actions;
export default authSlice.reducer;

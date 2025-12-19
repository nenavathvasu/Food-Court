import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./axiosInstance";

/* =========================
   LOGIN USER
========================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/login", credentials);
      return res.data; // { token, user, tokenExpiresAt }
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
      const res = await api.post("/user/register", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  tokenExpiresAt: Number(localStorage.getItem("tokenExpiresAt")) || null,
  loading: false,
  error: null,
};

/* =========================
   AUTH SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiresAt = null;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiresAt");

      window.location.href = "/login";
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
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

        const { token, user, tokenExpiresAt } = action.payload;

        state.token = token;
        state.user = user;
        state.tokenExpiresAt = tokenExpiresAt;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiresAt", tokenExpiresAt);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- REGISTER ---- */
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
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

/* =========================
   AUTO LOGOUT (TOKEN EXPIRY)
========================= */
setInterval(() => {
  const token = localStorage.getItem("token");
  const expiry = Number(localStorage.getItem("tokenExpiresAt"));

  if (token && expiry && Date.now() > expiry) {
    localStorage.clear();
    window.location.href = "/login";
  }
}, 5000);

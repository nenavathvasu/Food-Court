// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { clearOrders } from "../orders/orderSlice";

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/user/login", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/user/register", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

// Update profile — PATCH /user/profile
export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch("/user/profile", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

// Change password — PATCH /user/change-password
export const changePassword = createAsyncThunk("auth/changePassword", async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch("/user/change-password", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Password change failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:            JSON.parse(localStorage.getItem("user")) || null,
    token:           localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading:         false,
    updateLoading:   false,
    error:           null,
    updateSuccess:   false,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      window.location.href  = "/login";
    },
    clearError:         (state) => { state.error = null; },
    clearUpdateSuccess: (state) => { state.updateSuccess = false; },
    // Optimistic local update — useful when backend isn't available
    updateUserLocally:  (state, { payload }) => {
      state.user = { ...state.user, ...payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.loading = false; s.user = payload.user; s.token = payload.token; s.isAuthenticated = true;
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user",  JSON.stringify(payload.user));
      })
      .addCase(loginUser.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      // Register
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; })

      // Update profile
      .addCase(updateProfile.pending,   (s) => { s.updateLoading = true; s.error = null; s.updateSuccess = false; })
      .addCase(updateProfile.fulfilled, (s, { payload }) => {
        s.updateLoading = false;
        s.updateSuccess = true;
        // Use returned user if backend sends it, otherwise merge payload
        const updatedUser = payload.user || { ...s.user, ...payload };
        s.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .addCase(updateProfile.rejected,  (s, { payload }) => { s.updateLoading = false; s.error = payload; })

      // Change password
      .addCase(changePassword.pending,   (s) => { s.updateLoading = true; s.error = null; s.updateSuccess = false; })
      .addCase(changePassword.fulfilled, (s) => { s.updateLoading = false; s.updateSuccess = true; })
      .addCase(changePassword.rejected,  (s, { payload }) => { s.updateLoading = false; s.error = payload; });
  },
});

export const { logout, clearError, clearUpdateSuccess, updateUserLocally } = authSlice.actions;
export default authSlice.reducer;
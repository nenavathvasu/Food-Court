// src/nonvegSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./axiosInstance";

// ✅ FETCH NON-VEG ITEMS
export const fetchNonveg = createAsyncThunk("nonveg/fetch", async () => {
  const res = await api.get("/menu/nonveg"); // correct backend route
  return res.data;
});

const nonvegSlice = createSlice({
  name: "nonveg",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNonveg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNonveg.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNonveg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch non-veg items";
      });
  },
});

export default nonvegSlice.reducer;

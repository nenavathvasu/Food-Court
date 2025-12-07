// src/nonvegSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./axiosInstance";

export const fetchNonveg = createAsyncThunk("nonveg/fetch", async () => {
  const res = await api.get("/menu/getnonveg");   // ✔ UPDATED ROUTE
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
        state.error = action.error.message;
      });
  },
});

export default nonvegSlice.reducer;

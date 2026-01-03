import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./axiosInstance";

export const fetchVeg = createAsyncThunk("veg/fetch", async () => {
  // ✅ relative path, proxy will forward to backend
  const res = await api.get("/veg");
  return res.data;
});

const vegSlice = createSlice({
  name: "veg",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVeg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVeg.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchVeg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch veg items";
      });
  },
});

export default vegSlice.reducer;

// src/features/menu/vegSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVegItems } from "../../api/menuApi";

export const fetchVeg = createAsyncThunk("veg/fetch", async (_, { rejectWithValue }) => {
  try {
    return await fetchVegItems();
  } catch (err) {
    return rejectWithValue(err.message || "Failed to fetch veg items");
  }
});

const vegSlice = createSlice({
  name: "veg",
  initialState: {
    data:        [],
    loading:     false,
    error:       null,
    currentPage: 1,
    itemsPerPage: 8,
  },
  reducers: {
    setVegPage:   (state, { payload }) => { state.currentPage = payload; },
    resetVegPage: (state)              => { state.currentPage = 1; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVeg.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchVeg.fulfilled, (s, { payload }) => { s.loading = false; s.data = payload || []; })
      .addCase(fetchVeg.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { setVegPage, resetVegPage } = vegSlice.actions;
export default vegSlice.reducer;
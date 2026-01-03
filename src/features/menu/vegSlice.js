// src/features/menu/vegSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVegItems } from "../../api/menuApi";

// FETCH VEG ITEMS
export const fetchVeg = createAsyncThunk(
  "veg/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchVegItems();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch veg items");
    }
  }
);

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
        state.data = action.payload || [];
      })
      .addCase(fetchVeg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vegSlice.reducer;

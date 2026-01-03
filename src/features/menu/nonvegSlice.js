// src/features/menu/nonvegSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNonVegItems } from "../../api/menuApi";

// FETCH NON-VEG ITEMS
export const fetchNonveg = createAsyncThunk(
  "nonveg/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchNonVegItems();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch non-veg items");
    }
  }
);

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
        state.data = action.payload || [];
      })
      .addCase(fetchNonveg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default nonvegSlice.reducer;

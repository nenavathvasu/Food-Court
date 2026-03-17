// src/features/menu/nonvegSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNonVegItems } from "../../api/menuApi";

export const fetchNonveg = createAsyncThunk("nonveg/fetch", async (_, { rejectWithValue }) => {
  try {
    const items = await fetchNonVegItems();
    // Normalise: ensure every item has consistent fields matching backend schema
    return (items || []).map(item => ({
      ...item,
      // Prefer MongoDB _id for React keys and wishlist tracking
      _id:          item._id || String(item.id),
      // Backend has `spicy` boolean — keep it; ProductCard can use it for a badge
      spicy:        item.spicy || false,
      // Use review count as popularity proxy (backend has no popularity field)
      popularity:   item.reviews || 0,
      originalPrice: item.originalPrice || item.price,
      discount:     item.discount || 0,
      stock:        item.stock ?? 100,
      bestseller:   item.bestseller || false,
    }));
  } catch (err) {
    return rejectWithValue(err.message || "Failed to fetch non-veg items");
  }
});

const nonvegSlice = createSlice({
  name: "nonveg",
  initialState: {
    data:         [],
    loading:      false,
    error:        null,
    currentPage:  1,
    itemsPerPage: 8,
  },
  reducers: {
    setNonvegPage:   (state, { payload }) => { state.currentPage = payload; },
    resetNonvegPage: (state)              => { state.currentPage = 1; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNonveg.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchNonveg.fulfilled, (s, { payload }) => { s.loading = false; s.data = payload; })
      .addCase(fetchNonveg.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { setNonvegPage, resetNonvegPage } = nonvegSlice.actions;
export default nonvegSlice.reducer;
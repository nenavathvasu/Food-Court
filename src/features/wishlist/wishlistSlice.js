// src/features/wishlist/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const load = () => {
  try { return JSON.parse(localStorage.getItem("fc_wishlist") || "[]"); }
  catch { return []; }
};
const save = (items) => localStorage.setItem("fc_wishlist", JSON.stringify(items));

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() },
  reducers: {
    toggleWishlist: (state, { payload }) => {
      const idx = state.items.findIndex(i => (i._id || i.id) === (payload._id || payload.id));
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(payload);
      save(state.items);
    },
    removeFromWishlist: (state, { payload }) => {
      state.items = state.items.filter(i => (i._id || i.id) !== payload);
      save(state.items);
    },
    clearWishlist: (state) => { state.items = []; save([]); },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
export const selectIsWishlisted = (id) => (s) =>
  s.wishlist.items.some(i => (i._id || i.id) === id);
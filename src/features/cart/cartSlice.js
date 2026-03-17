// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit"; // ✅ added createSelector
import { sendOrderToServer } from "../../api/menuApi";

const getId = (item) => item._id || item.id;

export const placeOrder = createAsyncThunk("cart/placeOrder", async (orderData, { rejectWithValue }) => {
  try {
    return await sendOrderToServer(orderData);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Order failed");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items:              [],
    discountPercentage: 0,
    loading:            false,
    orderSuccess:       false,
  },
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find(i => getId(i) === getId(payload));
      if (existing) existing.quantity += 1;
      else state.items.push({ ...payload, quantity: 1 });
    },
    incrementQuantity: (state, { payload }) => {
      const item = state.items.find(i => getId(i) === payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, { payload }) => {
      const item = state.items.find(i => getId(i) === payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter(i => getId(i) !== payload);
    },
    setDiscount: (state, { payload }) => {
      state.discountPercentage = payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountPercentage = 0;
    },
    resetOrderSuccess: (state) => { state.orderSuccess = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (state) => { state.loading = true;  state.orderSuccess = false; })
      .addCase(placeOrder.fulfilled, (state) => { state.loading = false; state.items = []; state.orderSuccess = true; })
      .addCase(placeOrder.rejected,  (state) => { state.loading = false; });
  },
});

export const {
  addToCart, incrementQuantity, decrementQuantity,
  removeFromCart, setDiscount, clearCart, resetOrderSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;

// ✅ FIX: memoized with createSelector — returns same reference when inputs unchanged
// Without this, every useSelector call gets a new object → warning + infinite rerenders
const selectCartItems    = (state) => state.cart.items;
const selectCartDiscount = (state) => state.cart.discountPercentage || 0;

export const selectCartTotals = createSelector(
  [selectCartItems, selectCartDiscount],
  (items, discountPercentage) => {
    const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const discountAmount = Math.round((subtotal * discountPercentage) / 100);
    const afterDiscount  = subtotal - discountAmount;
    const gst            = Math.round(afterDiscount * 0.05);
    const delivery       = subtotal > 0 ? 25 : 0;
    const handling       = subtotal > 0 ? 2  : 0;
    const smallCart      = subtotal > 0 && subtotal < 100 ? 20 : 0;
    const total          = afterDiscount + gst + delivery + handling + smallCart;
    return { subtotal, discountAmount, gst, delivery, handling, smallCart, total };
  }
);
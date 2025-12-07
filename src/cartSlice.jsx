// src/cartSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./axiosInstance";
import { toast } from "react-toastify";

const ORDER_URL = "/orders"; // base, axiosInstance provides baseURL automatically

// ================================
// PLACE ORDER
// ================================
export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await api.post(`${ORDER_URL}/placeOrder`, orderData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ================================
// FETCH ALL ORDERS
// ================================
export const fetchAllOrders = createAsyncThunk(
  "cart/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${ORDER_URL}/fetchOrders`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    discountPercentage: 0,
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      toast.success(`${item.name} added to cart`);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    incrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity++;
    },

    decrementQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0)
          state.items = state.items.filter((i) => i.id !== item.id);
      }
    },

    setDiscount(state, action) {
      state.discountPercentage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;

        toast.success("🎉 Order placed successfully!");

        if (action.payload?.result) {
          state.orders.push(action.payload.result);
        }

        // Clear cart on success
        state.items = [];
        state.discountPercentage = 0;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("❌ Failed to place order!");
      })

      // FETCH ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  setDiscount,
} = cartSlice.actions;

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectFinalTotal = (state) => {
  const subtotal = state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = (subtotal * state.cart.discountPercentage) / 100;
  const discountedSubtotal = subtotal - discount;
  const gst = discountedSubtotal * 0.12;
  return +(discountedSubtotal + gst).toFixed(2);
};

export default cartSlice.reducer;

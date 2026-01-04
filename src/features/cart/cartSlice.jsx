import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { sendOrderToServer } from "../../api/menuApi";

const getId = (item) => item._id || item.id;

// Place order
export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (order, { rejectWithValue }) => {
    try {
      return await sendOrderToServer(order);
    } catch (err) {
      return rejectWithValue("Failed to place order");
    }
  }
);

// Fetch orders
export const fetchAllOrders = createAsyncThunk(
  "cart/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/fetchOrders");
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    discountPercentage: 0,
    loading: false,
    error: null,
    allOrders: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        (i) => getId(i) === getId(action.payload)
      );
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((i) => getId(i) === action.payload);
      if (item) item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((i) => getId(i) === action.payload);
      if (item && item.quantity > 1) item.quantity--;
      else state.items = state.items.filter((i) => getId(i) !== action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => getId(i) !== action.payload);
    },
    setDiscount: (state, action) => {
      state.discountPercentage = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountPercentage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload || [];
        state.loading = false;
      });
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  setDiscount,
  clearCart,
} = cartSlice.actions;

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

export const selectFinalTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const discount = (subtotal * state.cart.discountPercentage) / 100;
  const gst = (subtotal - discount) * 0.12;
  return Number((subtotal - discount + gst).toFixed(2));
};

export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= PLACE ORDER API ================= */
export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "https://backend-express-nu.vercel.app/api/v1/orders/placeorder",
        orderData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    discountPercentage: 0,
    loading: false,
    orderSuccess: false, // flag to redirect
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        i => (i._id || i.id) === (action.payload._id || action.payload.id)
      );
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(i => (i._id || i.id) === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(i => (i._id || i.id) === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => (i._id || i.id) !== action.payload);
    },
    setDiscount: (state, action) => {
      state.discountPercentage = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountPercentage = 0;
    },
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.orderSuccess = false;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.orderSuccess = true; // redirect trigger
      })
      .addCase(placeOrder.rejected, (state) => {
        state.loading = false;
        state.orderSuccess = false;
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
  resetOrderSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;

/* ================= SELECTOR ================= */
export const selectCartTotals = (state) => {
  const itemsTotal = state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge = itemsTotal > 0 ? 25 : 0;
  const handlingCharge = itemsTotal > 0 ? 2 : 0;
  const smallCartCharge = itemsTotal > 0 && itemsTotal < 100 ? 20 : 0;

  return {
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal: itemsTotal + deliveryCharge + handlingCharge + smallCartCharge,
  };
};

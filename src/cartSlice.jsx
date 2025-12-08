import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendOrderToServer } from "./api";
import api from "./axiosInstance"; // IMPORTANT for protected API calls



// ===============================
// PLACE ORDER (POST)
// ===============================
export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (order, { rejectWithValue }) => {
    try {
      const res = await sendOrderToServer(order);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);


// ===============================
// FETCH ALL ORDERS (GET)
// ===============================
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/fetchOrders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);




// ===============================
// INITIAL STATE
// ===============================
const initialState = {
  items: [],
  discountPercentage: 0,
  loading: false,
  error: null,
  allOrders: []   // ← IMPORTANT
};




// ===============================
// SLICE
// ===============================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.id === item.id || i._id === item._id
      );
      if (existing) existing.quantity += 1;
      else state.items.push({ ...item, quantity: 1 });
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => (i.id || i._id) !== action.payload
      );
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find(
        (i) => (i.id || i._id) === action.payload
      );
      if (item) item.quantity++;
    },

    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => (i.id || i._id) === id);
      if (item && item.quantity > 1) item.quantity--;
      else state.items = state.items.filter((i) => (i.id || i._id) !== id);
    },

    setDiscount: (state, action) => {
      state.discountPercentage = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.discountPercentage = 0;
    }
  },

  extraReducers: (builder) => {
    builder
      // PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});




// ===============================
// EXPORT ACTIONS
// ===============================
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  setDiscount,
  clearCart
} = cartSlice.actions;




// ===============================
// SELECTORS
// ===============================
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

export const selectFinalTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const discount = (subtotal * (state.cart.discountPercentage || 0)) / 100;
  const discounted = subtotal - discount;
  const gst = discounted * 0.12;
  return Number((discounted + gst).toFixed(2));
};



export default cartSlice.reducer;

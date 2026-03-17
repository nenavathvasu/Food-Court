// src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllOrdersFromServer } from "../../api/menuApi";

// Accept email so we can pass it to the API and also filter client-side
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (email, { rejectWithValue }) => {
    try {
      const data = await fetchAllOrdersFromServer(email);
      return { data, email };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list:    [],   // filtered list for the current user
    loading: false,
    error:   null,
  },
  reducers: {
    clearOrders: (state) => {
      state.list  = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (s) => {
        s.loading = true;
        s.error   = null;
      })
      .addCase(fetchAllOrders.fulfilled, (s, { payload }) => {
        s.loading = false;
        const { data, email } = payload;

        // Client-side filter — guaranteed safety net even if the backend
        // ignores the ?email= query param and returns all orders
        s.list = email
          ? (data || []).filter(
              (o) => o.customerEmail?.toLowerCase() === email.toLowerCase()
            )
          : (data || []);
      })
      .addCase(fetchAllOrders.rejected, (s, { payload }) => {
        s.loading = false;
        s.error   = payload;
      });
  },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
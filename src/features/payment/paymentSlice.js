// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// Create Razorpay order on backend → GET /payment/create-order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async (amount, { rejectWithValue }) => {
    try {
      const res = await api.post("/payment/create-order", { amount });
      return res.data;   // { orderId, amount, currency, keyId }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Could not initiate payment");
    }
  }
);

// Verify payment signature on backend after Razorpay callback
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/payment/verify", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading:       false,
    verifying:     false,
    success:       false,
    failed:        false,
    error:         null,
    paymentId:     null,
    orderId:       null,
    method:        null,   // "online" | "cod"
  },
  reducers: {
    resetPayment: (state) => {
      state.loading   = false;
      state.verifying = false;
      state.success   = false;
      state.failed    = false;
      state.error     = null;
      state.paymentId = null;
      state.orderId   = null;
      state.method    = null;
    },
    setPaymentMethod: (state, { payload }) => { state.method = payload; },
    setCodSuccess: (state) => { state.success = true; state.method = "cod"; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(createRazorpayOrder.fulfilled, (s, { payload }) => { s.loading = false; s.orderId = payload.orderId; })
      .addCase(createRazorpayOrder.rejected,  (s, { payload }) => { s.loading = false; s.error = payload; s.failed = true; })

      .addCase(verifyPayment.pending,   (s) => { s.verifying = true; })
      .addCase(verifyPayment.fulfilled, (s, { payload }) => {
        s.verifying = false;
        s.success   = true;
        s.paymentId = payload.paymentId;
      })
      .addCase(verifyPayment.rejected,  (s, { payload }) => { s.verifying = false; s.error = payload; s.failed = true; });
  },
});

export const { resetPayment, setPaymentMethod, setCodSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
// src/features/payment/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    success: false,
    loading: false,
  },
  reducers: {
    setCodSuccess: (state) => {
      state.success = true;
      state.loading = false;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    resetPayment: (state) => {
      state.success = false;
      state.loading = false;
    },
  },
});

export const { setCodSuccess, setLoading, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
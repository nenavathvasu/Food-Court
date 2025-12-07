import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3000/api";

// ===============================
// FETCH VEG ITEMS
// ===============================
export const fetchVegItems = createAsyncThunk(
  "cart/fetchVegItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/getveg`);
      return res.data; // Should return array of veg items
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load veg items");
    }
  }
);

// ===============================
// FETCH NON-VEG ITEMS
// ===============================
export const fetchNonvegItems = createAsyncThunk(
  "cart/fetchNonvegItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/getnonveg`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load non-veg items"
      );
    }
  }
);

// ===============================
// PLACE ORDER
// ===============================
export const sendOrderToServer = createAsyncThunk(
  "cart/sendOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("Sending Order:", orderData);

      const res = await axios.post(`${BASE_URL}/orders/placeorder`, orderData);

      return res.data; // Returns { message, result }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to place order"
      );
    }
  }
);


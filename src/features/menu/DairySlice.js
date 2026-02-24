import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/v1/dairy"; // 🔁 change when deploying

export const fetchDairy = createAsyncThunk("dairy/fetchDairy", async () => {
  const res = await axios.get(API);
  return res.data;
});

const dairySlice = createSlice({
  name: "dairy",
  initialState: {
    data: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDairy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDairy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDairy.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dairySlice.reducer;

// src/api/menuApi.js
import api from "./axiosInstance";

// VEG ITEMS
export const fetchVegItems = async () => {
  const res = await api.get("/menu/veg");
  return res.data;
};

// NON-VEG ITEMS
export const fetchNonVegItems = async () => {
  const res = await api.get("/menu/nonveg");
  return res.data;
};

// PLACE ORDER
export const sendOrderToServer = async (order) => {
  const res = await api.post("/orders/placeorder", order);
  return res.data;
};

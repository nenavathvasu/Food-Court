// services/api.js
import api from "../api/axiosInstance"; // uses /api base

/* ================= MENU ================= */

// GET Veg Items
export const fetchVegItems = async () =>
  (await api.get("/menu/veg")).data;

// GET Non-Veg Items
export const fetchNonVegItems = async () =>
  (await api.get("/menu/nonveg")).data;

/* ================= ORDERS ================= */

// POST Order
export const sendOrderToServer = async (order) =>
  (await api.post("/orders/placeorder", order)).data;
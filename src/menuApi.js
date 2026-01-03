// src/menuApi.js
import axios from "axios";

const BASE_URL = "https://backend-express-nu.vercel.app/api/v1";

/* ================= MENU ================= */

// GET Veg Items
export const fetchVegItems = async () =>
  (await axios.get(`${BASE_URL}/menu/veg`)).data;

// GET Non-Veg Items
export const fetchNonVegItems = async () =>
  (await axios.get(`${BASE_URL}/menu/nonveg`)).data;

/* ================= ORDERS ================= */

// POST Order
export const sendOrderToServer = async (order, token) =>
  (
    await axios.post(`${BASE_URL}/orders/`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;

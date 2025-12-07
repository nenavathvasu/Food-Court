import axios from "axios";

const BASE_URL = "https://food-court-i2gj.onrender.com";

// GET Veg Items
export const fetchVegItems = async () =>
  (await axios.get(`${BASE_URL}/veg`)).data;

// GET Non-Veg Items
export const fetchNonVegItems = async () =>
  (await axios.get(`${BASE_URL}/nonveg`)).data;

// POST Order --> /api/orders/placeorder
export const sendOrderToServer = async (order) =>
  (await axios.post(`${BASE_URL}/orders/placeorder`, order)).data;

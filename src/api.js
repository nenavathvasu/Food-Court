import api from "./api/axiosInstance"; // uses /api base


const BASE_URL = "https://backend-express-nu.vercel.app/";

/* ================= MENU ================= */

// GET Veg Items
/* ================= ORDERS ================= */

// POST Order ✅ FIXED


export const fetchVegItems = async () =>
  (await api.get("/menu/getveg")).data;

export const fetchNonVegItems = async () =>
  (await api.get("/menu/getnonveg")).data;

export const sendOrderToServer = async (order) =>
  (await api.post("/orders/placeorder", order)).data;


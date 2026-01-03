import api from "./axiosInstance"; // uses /api base

<<<<<<< HEAD
const BASE_URL = "https://backend-express-nu.vercel.app";

/* ================= MENU ================= */

// GET Veg Items
export const fetchVegItems = async () =>
  (await axios.get(`${BASE_URL}/api/v1/menu`)).data;


export const fetchNonVegItems = async () =>
  (await axios.get(`${BASE_URL}/api/v1/menu`)).data;

/* ================= ORDERS ================= */

// POST Order ✅ FIXED
export const sendOrderToServer = async (order, token) =>
  (await axios.post(
    `${BASE_URL}/api/v1/orders/`,
    order,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )).data;
=======
export const fetchVegItems = async () =>
  (await api.get("/menu/getveg")).data;

export const fetchNonVegItems = async () =>
  (await api.get("/menu/getnonveg")).data;

export const sendOrderToServer = async (order) =>
  (await api.post("/orders/placeorder", order)).data;
>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b

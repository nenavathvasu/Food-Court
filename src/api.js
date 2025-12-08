import api from "./axiosInstance"; // uses /api base

export const fetchVegItems = async () =>
  (await api.get("/menu/getveg")).data;

export const fetchNonVegItems = async () =>
  (await api.get("/menu/getnonveg")).data;

export const sendOrderToServer = async (order) =>
  (await api.post("/orders/placeorder", order)).data;

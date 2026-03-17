// src/api/menuApi.js
import api from "./axiosInstance";

export const fetchVegItems    = () => api.get("/menu/veg").then(r => r.data);
export const fetchNonVegItems = () => api.get("/menu/nonveg").then(r => r.data);
export const sendOrderToServer = (order) => api.post("/orders/placeorder", order).then(r => r.data);
export const fetchAllOrdersFromServer = () => api.get("/orders").then(r => r.data);
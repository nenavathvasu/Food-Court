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

// PLACE ORDER (PUBLIC NOW)
export const sendOrderToServer = async (order) => {
  const res = await api.post("/orders/placeorder", order);
  return res.data;
};

// FETCH ALL ORDERS (PUBLIC NOW)
export const fetchAllOrdersFromServer = async () => {
  const res = await api.get("/orders");
  return res.data;
};
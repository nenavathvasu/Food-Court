// src/api/axiosInstance.js
import axios from "axios";

/*
  DEV  → /api/v1/... → Vite proxy → foodcourtbackend.onrender.com
  PROD → VITE_API_URL set in Vercel → calls Render directly
*/
const BASE_URL = "https://foodcourtbackend.onrender.com/api/v1";
   `${import.meta.env.VITE_API_URL}/api/v1`
   "/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT — skip for public /orders routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url?.includes("/orders")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
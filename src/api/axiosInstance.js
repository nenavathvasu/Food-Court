// src/api/axiosInstance.js
import axios from "axios";

/*
  ┌─────────────────────────────────────────────────────────────┐
  │  BASE URL STRATEGY                                          │
  │                                                             │
  │  LOCAL DEV  → requests hit /api/v1/...                      │
  │               Vite proxy forwards them to Render backend    │
  │               Browser sees only localhost → no CORS errors  │
  │                                                             │
  │  PRODUCTION → VITE_API_URL env var is set in Vercel         │
  │               = https://foodcourtbackend.onrender.com       │
  │               Axios calls Render directly, CORS is allowed  │
  └─────────────────────────────────────────────────────────────┘
*/
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "/api/v1";  // dev: uses Vite proxy

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
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
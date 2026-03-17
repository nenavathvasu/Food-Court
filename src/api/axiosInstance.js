// src/api/axiosInstance.js
import axios from "axios";

/*
  BASE URL STRATEGY
  ─────────────────────────────────────────────────────────────
  Development  → requests go to /api/v1/...
                 Vite proxy intercepts and forwards to
                 https://backend-express-nu.vercel.app/api/v1/...
                 Browser sees only localhost → zero CORS issues

  Production   → set VITE_API_URL in your hosting env vars
                 e.g. VITE_API_URL=https://backend-express-nu.vercel.app
                 and configure CORS on the backend for your production domain
  ─────────────────────────────────────────────────────────────
*/
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "/api/v1";   // ← uses Vite proxy in dev

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token — skip for /orders (public routes)
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
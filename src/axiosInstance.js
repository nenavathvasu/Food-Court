import axios from "axios";

/*
  Vite uses import.meta.env
  Fallback is localhost backend
*/
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/*
  Axios instance
  ❌ withCredentials REMOVED (you are not using cookies)
*/
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

/* =========================
   REQUEST INTERCEPTOR
   Attach JWT token
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   Auto logout on 401
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiresAt");

      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

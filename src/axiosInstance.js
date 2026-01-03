import axios from "axios";

<<<<<<< HEAD
// Use relative path for proxy
const api = axios.create({
  baseURL: "/api", // Vite will forward /api/... to backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
=======
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

>>>>>>> fa51636cd20b0b4a11bbbbe4e314ab79259d776b
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

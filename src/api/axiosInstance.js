import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-express-nu.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token EXCEPT for public order routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ Do NOT attach token for orders endpoints
  if (token && !config.url.includes("/orders")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto logout on 401 (keep this for login-protected features if added later)
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
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Every request to /api/* gets forwarded to the backend
      // The browser only sees localhost:5173 → no CORS issue
      "/api": {
        target: "https://backend-express-nu.vercel.app",
        changeOrigin: true,   // spoofs the Host header so the server accepts it
        secure: true,         // allows HTTPS target
      },
    },
  },
});
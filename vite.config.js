// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Local dev only — proxies /api requests to your Render backend
      // This avoids CORS in development. In production Vercel uses VITE_API_URL directly.
      "/api": {
        target: "https://foodcourtbackend.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
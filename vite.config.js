import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api requests to backend
      "/api": {
        target: "https://backend-express-nu.vercel.app/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"), 
        // So /api/menu/veg → backend /api/v1/menu/veg
      },
    },
  },
});

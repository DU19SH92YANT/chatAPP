import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:8000", // Backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/v1/, "/v1"), // Optional path rewrite
      },
      "/socket.io": {
        target: "http://localhost:8000", // Ensure WebSocket connections are proxied
        ws: true, // Important for WebSockets
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/register": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/login": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/profile": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/branch": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/task": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/tasks": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/labels": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/insights": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});

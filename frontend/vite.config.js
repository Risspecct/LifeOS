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
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/profile": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/branch": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/task": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/tasks": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/leaderboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/friends": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      },
      "/labels": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/notifications": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/insights": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/stats": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes("text/html")) return "/index.html";
        }
      }
    }
  }
});

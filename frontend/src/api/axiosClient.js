import axios from "axios";
import { AUTH_TOKEN_KEY } from "../utils/constants";
import { API_BASE_URL } from "../config/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      if (config.headers && config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    if (import.meta.env.DEV) {
      console.log("[API][request]", {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        data: config.data
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("[API][response]", {
        status: response.status,
        url: response.config?.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url ?? "";
    const isAuthRequest =
      typeof requestUrl === "string" &&
      ["/api/auth/login", "/api/auth/register", "/api/auth/oauth/exchange"].some((path) => requestUrl.startsWith(path));

    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthRequest) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }

    if (import.meta.env.DEV) {
      console.error("[API][error]", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;

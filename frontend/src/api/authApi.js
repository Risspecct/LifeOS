import apiClient, { API_BASE_URL } from "./axiosClient";

export const signup = async (payload) => {
  console.log("[AuthAPI] signup called with payload:", payload);
  const response = await apiClient.post("/api/auth/register", payload);
  console.log("[AuthAPI] signup success response:", response.data);
  return response.data;
};

export const login = async (payload) => {
  const response = await apiClient.post("/api/auth/login", payload);
  return response.data;
};

export const exchangeOAuthCode = async (payload) => {
  const response = await apiClient.post("/api/auth/oauth/exchange", payload);
  return response.data;
};

export const startGoogleOAuthLogin = () => {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};

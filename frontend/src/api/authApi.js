import apiClient from "./axiosClient";

export const signup = async (payload) => {
  console.log("[AuthAPI] signup called with payload:", payload);
  const response = await apiClient.post("/register", payload);
  console.log("[AuthAPI] signup success response:", response.data);
  return response.data;
};

export const login = async (payload) => {
  const response = await apiClient.post("/login", payload);
  return response.data;
};

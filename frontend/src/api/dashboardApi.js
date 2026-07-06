import apiClient from "./axiosClient";

export const getDashboard = async () => {
  const response = await apiClient.get("/api/dashboard");
  return response.data;
};

export const getLabels = async () => {
  const response = await apiClient.get("/api/labels");
  return response.data;
};

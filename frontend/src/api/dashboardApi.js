import apiClient from "./axiosClient";

export const getDashboard = async () => {
  const response = await apiClient.get("/dashboard");
  return response.data;
};

export const getLabels = async () => {
  const response = await apiClient.get("/labels");
  return response.data;
};

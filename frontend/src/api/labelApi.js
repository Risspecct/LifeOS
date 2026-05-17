import apiClient from "./axiosClient";

export const getLabels = async () => {
  const response = await apiClient.get("/labels");
  return response.data;
};

export const createLabel = async (payload) => {
  const response = await apiClient.post("/labels", payload);
  return response.data;
};

export const updateLabel = async (labelId, payload) => {
  const response = await apiClient.put(`/labels/${labelId}`, payload);
  return response.data;
};

export const deleteLabel = async (labelId) => {
  const response = await apiClient.delete(`/labels/${labelId}`);
  return response.data;
};

export const seedDefaultLabels = async () => {
  const response = await apiClient.post("/labels/defaults");
  return response.data;
};

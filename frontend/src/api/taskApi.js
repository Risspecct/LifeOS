import apiClient from "./axiosClient";

export const getAllTasks = async () => {
  const response = await apiClient.get("/task/all");
  return response.data;
};

export const getTasks = async (filters = {}) => {
  const params = {};

  if (filters.status) params.status = filters.status;
  if (filters.label) params.label = filters.label;
  if (filters.taskType) params.taskType = filters.taskType;

  const response = await apiClient.get("/task", { params });
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await apiClient.get(`/task/${taskId}`);
  return response.data;
};

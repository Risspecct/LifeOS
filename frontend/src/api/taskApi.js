import apiClient from "./axiosClient";

export const getAllTasks = async () => {
  const response = await apiClient.get("/task/all");
  return response.data;
};

export const createTask = async (payload) => {
  const response = await apiClient.post("/task", payload);
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

export const updateTask = async (taskId, payload) => {
  const response = await apiClient.put(`/task/${taskId}`, payload);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await apiClient.put(`/task/${taskId}/${status}`);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete("/task", { params: { taskId } });
  return response.data;
};

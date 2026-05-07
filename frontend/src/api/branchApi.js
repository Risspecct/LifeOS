import apiClient from "./axiosClient";

export const getBranches = async () => {
  const response = await apiClient.get("/branch");
  return response.data;
};

export const createBranch = async (payload) => {
  const response = await apiClient.post("/branch", payload);
  return response.data;
};

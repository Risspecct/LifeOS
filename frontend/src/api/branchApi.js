import apiClient from "./axiosClient";

export const getBranches = async () => {
  const response = await apiClient.get("/api/branch");
  return response.data;
};

export const createBranch = async (payload) => {
  const response = await apiClient.post("/api/branch", payload);
  return response.data;
};

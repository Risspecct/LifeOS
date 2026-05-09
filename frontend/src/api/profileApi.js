import apiClient from "./axiosClient";

export const getCurrentProfile = async () => {
  const response = await apiClient.get("/profile");
  if (!response?.data || typeof response.data !== "object" || Array.isArray(response.data)) {
    throw new Error("Invalid profile response received.");
  }
  return response.data;
};

export const createProfile = async (payload) => {
  const response = await apiClient.post("/profile", payload);
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await apiClient.put("/profile", payload);
  return response.data;
};

export const updateProfileBranch = async (branchId) => {
  const response = await apiClient.put(`/profile/${branchId}`);
  return response.data;
};

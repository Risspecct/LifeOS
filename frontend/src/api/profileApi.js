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

export const getPublicProfile = async (userId) => {
  const numericUserId = Number(userId);
  if (!Number.isFinite(numericUserId) || numericUserId <= 0) {
    throw new Error("Invalid user id for public profile.");
  }
  const response = await apiClient.get(`/profile/${numericUserId}`);
  if (!response?.data || typeof response.data !== "object" || Array.isArray(response.data)) {
    throw new Error("Invalid public profile response received.");
  }
  return response.data;
};

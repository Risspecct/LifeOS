import apiClient from "./axiosClient";

export const LEADERBOARD_SCOPES = {
  GLOBAL: "GLOBAL",
  FRIENDS: "FRIENDS",
  COLLEGE: "COLLEGE"
};

export const getLeaderboard = async (scope = LEADERBOARD_SCOPES.GLOBAL) => {
  const response = await apiClient.get(`/leaderboard?scope=${scope}`);
  if (!Array.isArray(response?.data)) {
    throw new Error("Invalid leaderboard response format.");
  }
  return response.data;
};

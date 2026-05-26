import apiClient from "./axiosClient";

export const getMyStats = async () => {
  const response = await apiClient.get("/stats/me");

  // Backend source of truth: UserStatsDto record
  // { totalPoints: Long, currentStreak: Integer, longestStreak: Integer, tasksCompleted: Integer }
  const data = response?.data;

  // Common dev misconfig: missing Vite proxy causes index.html (string) to be returned.
  if (typeof data === "string") {
    const fingerprint = data.slice(0, 200).toLowerCase();
    if (fingerprint.includes("<!doctype") || fingerprint.includes("<html")) {
      throw new Error("Stats endpoint returned HTML instead of JSON (check Vite proxy for /stats and backend availability).");
    }
    throw new Error("Invalid stats response received.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid stats response received.");
  }

  return data;
};

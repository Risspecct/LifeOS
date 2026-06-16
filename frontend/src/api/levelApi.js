import apiClient from "./axiosClient";

export const getMyLevel = async () => {
  const response = await apiClient.get("/api/levels/me");
  const data = response?.data;

  if (typeof data === "string") {
    const fingerprint = data.slice(0, 200).toLowerCase();
    if (fingerprint.includes("<!doctype") || fingerprint.includes("<html")) {
      throw new Error("Level endpoint returned HTML instead of JSON (check Vite proxy for /levels and backend availability).");
    }
    throw new Error("Invalid level response received.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid level response received.");
  }

  return data;
};

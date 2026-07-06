import apiClient from "./axiosClient";

const FRIEND_HIGHLIGHT_ACTIVITY_TYPES = new Set([
  "LEVEL_UP",
  "STREAK_MILESTONE",
  "PRODUCTIVITY_MILESTONE"
]);
const LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const isValidFriendActivityResponse = (value) => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.userId === "number" &&
    typeof value.username === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.createdAt === "string" &&
    LOCAL_DATE_TIME_PATTERN.test(value.createdAt) &&
    FRIEND_HIGHLIGHT_ACTIVITY_TYPES.has(value.activityType)
  );
};

export const getFriendFeed = async () => {
  const response = await apiClient.get("/api/social/feed", {
    headers: {
      Accept: "application/json"
    }
  });
  const data = response?.data;

  if (typeof data === "string") {
    const fingerprint = data.slice(0, 200).toLowerCase();
    if (fingerprint.includes("<!doctype") || fingerprint.includes("<html")) {
      throw new Error("Friend feed endpoint returned HTML instead of JSON.");
    }
    throw new Error("Invalid friend feed response received.");
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid friend feed response received.");
  }

  if (!data.every(isValidFriendActivityResponse)) {
    throw new Error("Friend feed response does not match FriendActivityResponse[].");
  }

  return data;
};

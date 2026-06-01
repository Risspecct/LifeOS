import apiClient from "../api/axiosClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return Array.isArray(response?.data) ? response.data : [];
};

export const getUnreadCount = async () => {
  const response = await apiClient.get("/notifications/unread-count");
  // backend may return { count: number } or a bare number
  if (response?.data == null) return 0;
  if (typeof response.data === "number") return response.data;
  return typeof response.data.count === "number" ? response.data.count : 0;
};

export const markAsRead = async (notificationId) => {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
};
